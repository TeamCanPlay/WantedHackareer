var admin = require("firebase-admin");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response")
const { errResponse } = require("../../../config/response")

// 파이어 베이스에서 받은 키값으로 입력
var serviceAccount = require("../config/serviceAccountKey.json"); 
const firebaseDB = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

exports.sendCloudMessage = async function (req, res) {
    // logger.info(`파이어베이스 클라우드 메시지 수신 여부 갱신 API 호출 테스트`);
    const fcmToken = req.body.token;
    if (!token) return res.json({
        isSuccess: false,
        message: "토큰 값을 올바르게 입력해주세요."
    });
    const platform = req.body.platform;
    if (!platform || (platform !== 'AOS' && platform !== 'iOS'))
        return res.json({
            isSuccess: false,
            message: "플랫폼 값을 올바르게 입력해주세요."
        });
    // AOS 에서 Wake Lock 하려면 notification 이 없어야 함
    // iOS 에서는 notification 이 필요함
    const payload = {};
    if (platform === 'AOS') {
        payload.data = {
            title: 'data-title',
            body: 'data-body',
            type: '',
        }
    } else {
        payload.notification = {
            title: 'noti-title',
            body: 'noti-body',
            type: '',
            sound: 'default'
        }
    }
    admin.messaging().sendToDevice(fcmToken, payload)
        .then(async function (response) {
            res.json({
                isSuccess: true,
                message: "푸시 메시지 송신 성공(" + response.successCount + ")건, 실패(" + response.failureCount + ")건"
            })
        })
        .catch(function (error) {
            logger.error(`(POST)[send-cloud-message] Send to device error \n: ${err.message}`);
            return res.status(500).send(`Error: ${error.message}`);
        });
}