//프록시 사용을 위한 스크립트, 리액트 앱 실행시 자동으로 실행된다.
//cors 이슈 해결됨.
const { createProxyMiddleware } = require('http-proxy-middleware');

//_api 경로에만, 프록시 설정.
//다음과 같이 특정 경로가 요청된다면, 프록시가 사용된다.
//여러 경로에 대한 설정 가능.
module.exports = function(app) {
  // app.use(
  //   '/',
  //   createProxyMiddleware({
  //     target: 'http://pornhub.com',
  //     changeOrigin: true,
  //   })
  // );
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
  // app.use(
  //   '/backend',
  //   createProxyMiddleware({
  //     target: 'http://123.456.7.89',
  //     changeOrigin: true,
  //   })
  // );
};