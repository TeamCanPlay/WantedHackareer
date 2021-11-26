module.exports = function(app){
    const activity = require('./activityController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    
    
    //액티비티 영상 가져오기
    app.get('/activity-video',activity.getActivityVideo);
    
    //액티비티 영상 등록
    app.post('/activity-video',jwtMiddleware,activity.postActivityVideo);

    //S3 스토리지 동영상 업로드
    app.post('/activity-video-tos3',activity.uploadToS3);

};