module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //회원가입
    app.post('/users',user.postUsers);

    //로그인
    app.post('/users/login',user.login);

    // JWT 검증 API
    app.get('/check', jwtMiddleware, user.check);

    // 회원 전체 조회 + 이메일로 조회 API
    app.get('/users',user.getUsers);







    // 회원 조회 API
    app.get('/app/users/:userId', jwtMiddleware, user.getUserById); 

    //회원 정보 수정 API
    app.route('/app/users/:userId').patch(jwtMiddleware, user.patchUsers); 

    // 로그인 하기 API
    app.route('/app/login').post(user.login); 

    //회원 정보 수정 API
    app.route('/app/users/:userId/status').patch(jwtMiddleware, user.patchUserStatus); 

   // JWT 검증 API
    app.get('/app/users/check', jwtMiddleware, user.check);

  
};