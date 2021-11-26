const jwtMiddleware = require("../../../config/jwtMiddleware");
const regexEmail = require("regex-email");
const activityProvider = require("../../app/Activity/activityProvider");
const activityService = require("../../app/Activity/activityService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");
const secretKey = require('../../../config/secret');

//aws s3 업로드 관련
const fs = require("fs");
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId:secretKey.AWS_ACCESS_KEY,
  secretAccessKey:secretKey.AWS_SECRET_ACCESS_KEY,
  region:"ap-northeast-2"
})

const { emit } = require("nodemon");


/** 액티비티 동영상 업로드
 * [POST] /activity-video
 * body : videoUrl,comment,category
 */
exports.postActivityVideo = async function (req, res) {
  const {videoUrl, comment,category} = req.body;
  const userIdx = req.verifiedToken.userIdx;

  if (!videoUrl) {
    return res.send(errResponse(baseResponse.MANDATORY_REQUEST_EMPTY));
  }

  if (comment.length > 500) {
    return res.send(errResponse(baseResponse.COMMENT_LENGTH_WRONG));
  }

  const postActivityVideoResponse = await activityService.postActivityVideo(videoUrl,comment,userIdx,category);

  return res.send(postActivityVideoResponse);
};

/** 액티비티 동영상 가져오기
 * [GET] /activity-video?page=0&limit=10
 * query : page,limit
 */
exports.getActivityVideo = async function (req, res) {
  const {page,limit} = req.query;

  if (!page || !limit) {
    return res.send(errResponse(baseResponse.MANDATORY_REQUEST_EMPTY));
  }

  const getActivityVideoResponse = await activityProvider.getActivityVideo(Number(page),Number(limit));
  return res.send(res.send(response(baseResponse.SUCCESS, getActivityVideoResponse)));
};

/** 액티비티 동영상 업로드
 * [POST] /activity-video-tos3
 * body : binaryfile (mp4)
 */
exports.uploadToS3 = async function (file,res) {

  let params = {
    Bucket: 'playteam',
    Key: "SOT-activityVideo/"+Date.now(),
    ACL: "public-read",
    //  Body: fs.createReadStream("./testImg.png"),
    Body: file,
    ContentType: "video/mp4",
    Conditions: [
      ['content-length-range', 0, 15000000], // 10 Mb
    ]
    //ContentType: "image/png"
  };

  s3.upload(params, function(err, data) {
    if (err) {
      console.log("Error : ", err);
      return res.send((response(baseResponse.SIZE_WRONG)));
    }
    console.log("============================================");
    console.log("Data : ", data);
    return res.send((response(baseResponse.SUCCESS,{videoUrl:data.Location})));
  });
};







