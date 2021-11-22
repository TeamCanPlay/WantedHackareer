module.exports = function(app){
    const activity = require('./activityController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    
    
    //액티비티 영상 가져오기
    app.get('/activity-video',activity.getActivityVideo);
    
    //액티비티 영상 등록
    app.post('/activity-video',jwtMiddleware,activity.postActivityVideo);


};