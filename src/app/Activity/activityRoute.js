module.exports = function(app){
    const activity = require('./activityController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //회원가입
    app.post('/activity-video',jwtMiddleware,activity.postActivityVideo);


};