//익스프레스 모듈을 가져와서, 앱을 만들고, 포트를 설정한다. 
//몽구스 설치 - npm install mongoose
const express = require('express')
const app = express()
const port = 3000

const {mongoSetting} = require('./config/key')
const {User} = require("./models/User")
const mongoose =require('mongoose')
const bodyParser = require('body-parser')

console.log(mongoSetting)

//for application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
//for application/json
app.use(bodyParser.json());

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
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})