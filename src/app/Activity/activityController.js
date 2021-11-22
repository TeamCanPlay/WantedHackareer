const jwtMiddleware = require("../../../config/jwtMiddleware");
const regexEmail = require("regex-email");
const activityProvider = require("../../app/Activity/activityProvider");
const activityService = require("../../app/Activity/activityService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");
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






