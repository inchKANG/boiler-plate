//익스프레스 모듈을 가져와서, 앱을 만들고, 포트를 설정한다. 
//몽구스 설치 - npm install mongoose
const express = require('express')
const app = express()
const port = 3000

const setting = require('./templete/setting.js')
const mongoSetting = setting.mongoSetting

const mongoose =require('mongoose')

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})