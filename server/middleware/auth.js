const { User } = require("../models/User");

let auth = (req, res, next) => {
  //인증처리를 하는곳,

  //클라이언트의 쿠키에서 토큰을 가져온다.
  //서버는 통신 시 항상 쿠키 정보를 보낸다.
  //그리고 쿠키 파서를 사용했기 때문에 req.cookies에는 쿠키 정보가 담겨 있다.
  let token = req.cookies.x_auth;

  //토큰을 복호화 한 후 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });
    //리퀘스트에 토큰과 유저를 넣어주다, 넣어주는 이유는 미들웨어 통과 후 쉽게 내용을 가져오기 위해서이다.
    req.token = token;
    req.user = user;
    next();
  });

  //유저가 있으면 인증, 유저가 없으면 인증 X
};

module.exports = { auth };
