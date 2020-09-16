//익스프레스 모듈을 가져와서, 앱을 만들고, 포트를 설정한다.
//몽구스 설치 - npm install mongoose
const express = require("express");
const app = express();
const port = 3000;

const { mongoSetting } = require("./config/key");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookiePaarser = require("cookie-parser");

//for application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//for application/json
app.use(bodyParser.json());
//for cookie-parser
app.use(cookiePaarser());

mongoose
  .connect(`mongodb://${mongoSetting.ip}/${mongoSetting.db}`, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
    user: mongoSetting.user,
    pass: mongoSetting.pw,
  })
  .then(() => {
    console.log("connected");
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/", (req, res) => {
  res.send("Hello Worsslddd!");
});

app.post("/api/users/register", (req, res) => {
  //회원가입할때 필요한 정보들을 클라이언트에서 가져오면
  //그것들을 데이터베이스에 넣어준다.
  const user = new User(req.body);
  // console.log(user);
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });

    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  //요청된 이메일을 DB에서 찾는다.

  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      //만약 에러가 있다면
      if (err) return res.status(400).send(err);

      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });


      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        //에러가 없다면 토큰을 저장해야 함. 프론트단에서, 쿠키나, 로컬스토리지 등.
        //지금은 쿠키에 저장함.
        //이렇게 하면 프론트 단에 x_auth라는 이름의 쿠키가 저장되게 되고, json 으로 결과를 보여준다.
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });


      //auth 관련
      //1. 쿠키나 로컬 스토리지에 있는 토큰을 가져와서 복호화 시킴
      //2. 복호화된 토큰에서 가져온 아이디로 유저 정보를 가져옴.
      //3. 로컬에 저장되어 있는 토큰을 유저도 가지고 있는지 확인한다. 토큰이 일치하지 않으면, 로그인 실패.
    });
  });

  //비밀번호까지 맞다면 토큰을 생성한다.
});

//auth 미들웨어 사용. 경로 ./middleware/auth.js
//role 이 0이 아니면 관리자.
app.get("/api/users/auth", auth, (req, res) => {
  //미들웨어 통과 후 next를 통해 여기까지 온 것은,인증이 된 상태이다.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

//로그아웃 기능은, 유저가 토큰을 통한 인증이 필요한 부분에서 항상 /api/users/auth로 요청을 보내고,
//DB에 토큰이 없다면 인증이 실패하기 때문에, DB에 있는 토큰을 지워주면 된다.

app.get('/api/users/logout',auth,(req,res)=>{

  User.findOneAndUpdate({_id:req.user._id},
    {token:""},
    (err,user)=>{
      if(err) return res.json({success:false,err});
      return res.status(200).send({
        success:true
      })
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
