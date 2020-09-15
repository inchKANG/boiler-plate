const mongoose = require("mongoose");
const bcrpyt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlenth: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

//저장하기 전에 어떤 작업을 진행한다. pre()
//여기서 pre() 의 두번째 인자인 funcion을 화살표 함수를 사용한다면,
// this 가 undefined가 나오는 문제가 생겨 패스워드 값을 가져올 수 없다.
userSchema.pre("save", function(next){

  //클라이언트에서 보낸 user 정보 =this 와 동일.
  const user = this;
  //비밀번호가 변경될 때만 암호화를 해준다. -> 스키마에 필드에 패스워드가 있을떄.
  if(user.isModified('password')){
  //salt를 만든다. 만들때는 saltRound가 필요, 10 이면 10자의 salt로 암호화.
  bcrpyt.genSalt(saltRounds, (err, salt)=>{
    if (err) return next(err);
    //원본 비밀번호를 첫번째 arg로 넣는다.
    //hash 값이 암호화된 값이다.
    bcrpyt.hash(user.password, salt, (err, hash)=>{
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
  }else{
    next();
  }
});

userSchema.methods.comparePassword = function(plainPassword,callback){

  //그냥 비밀번호와 암호화된 비밀번호가 동일한지 체크.
  //bcrypt의 compare 을 통해 비교,
  bcrpyt.compare(plainPassword,this.password, function(err,isMatch){
    if(err) return callback(err)

    //성공시 에러는 null, isMatch는 true로 결과가 나올것. 
    callback(null,isMatch)
  })



}

userSchema.methods.generateToken=function(callback){

  const user =this;
  const token = jwt.sign(user._id.toHexString(),'secretToken');

  //jwt 인증 방식은 뒤에 있는 비밀 키를 통해 앞의 저장한 값을 가져 올 수 있다.
  //만들어지는 방식은 앞에 등록한 객체 혹은 문자열 + 뒤의 시크릿 키값
  user.token = token;
  user.save(function(err,user){
    if(err) return callback(err);

    callback(null,user)
  })

}

const User = mongoose.model("User", userSchema);

module.exports = { User };
