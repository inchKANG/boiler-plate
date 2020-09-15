//익스프레스 모듈을 가져와서, 앱을 만들고, 포트를 설정한다. 
//몽구스 설치 - npm install mongoose
const express = require('express')
const app = express()
const port = 3000

const {mongoSetting} = require('./config/key')
const {User} = require("./models/User")
const mongoose =require('mongoose')
const bodyParser = require('body-parser')
const cookiePaarser = require('cookie-parser')

//for application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
//for application/json
app.use(bodyParser.json());
//for cookie-parser
app.use(cookiePaarser());

mongoose.connect(`mongodb://${mongoSetting.ip}/${mongoSetting.db}`,{
  useNewUrlParser:true,
  useFindAndModify:false,
  useUnifiedTopology :true,
  useCreateIndex:true,
  user:mongoSetting.user,
  pass:mongoSetting.pw
})
.then(()=>{console.log('connected');})
.catch(e=>{console.log(e);});

app.get('/', (req, res) => {
  res.send('Hello Worsslddd!')
})


app.post('/register',(req,res)=>{
  //회원가입할때 필요한 정보들을 클라이언트에서 가져오면 
  //그것들을 데이터베이스에 넣어준다.
  const user =new User(req.body)
  // console.log(user);
  user.save((err,doc)=>{
    
    if(err) return res.json({success:false,err})

    return res.status(200).json({
      success:true
    })
  })
  
})

app.post('/login',(req,res)=>{

  //요청된 이메일을 DB에서 찾는다.

  User.findOne({email:req.body.email},(err,user)=>{
    if(!user){
      return res.json(
        {
          loginSuccess:false,
          message:"제공된 이메일에 해당하는 유저가 없습니다."
        })
    }
  //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
  user.comparePassword(req.body.password,(err,isMatch)=>{

    //만약 에러가 있다면

    if(err) return res.status(400).send(err);

    if(!isMatch)
    return res.json({loginSuccess:false,message:"비밀번호가 틀렸습니다."});

    user.generateToken((err,user)=>{
      if(err) return res.status(400).send(err);

      //에러가 없다면 토큰을 저장해야 함. 프론트단에서, 쿠키나, 로컬스토리지 등.
      //지금은 쿠키에 저장함.
      //이렇게 하면 프론트 단에 x_auth라는 이름의 쿠키가 저장되게 되고, json 으로 결과를 보여준다.
      res.cookie("x_auth",user.token)
      .status(200)
      .json({loginSuccess:true,userId:user._id})


    })



    

  })


  })



  //비밀번호까지 맞다면 토큰을 생성한다.

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})