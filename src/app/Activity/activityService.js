const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const secret_config = require("../../../config/secret");
const userProvider = require("./activityProvider");
const activityDao = require("./activityDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");
const { connect } = require("http2");

exports.postActivityVideo = async function (videoUrl, comment, userIdx,category) {
  try {

    const connection = await pool.getConnection(async (conn) => conn);
    const postActivityParams = [videoUrl, comment,category,userIdx]
    await activityDao.insertActivityVideo(connection,postActivityParams)
    connection.release();

    return response(baseResponse.SUCCESS);

  } catch (err) {
    logger.error(`App - postActivityVideo Service error\n: ${err.message} \n${JSON.stringify(err)}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};








exports.editUser = async function (id, nickname) {
  try {
    console.log(id)
    const connection = await pool.getConnection(async (conn) => conn);
    const editUserResult = await activityDao.updateUserInfo(connection, id, nickname)
    connection.release();

    return response(baseResponse.SUCCESS);

  } catch (err) {
    logger.error(`App - editUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

exports.editUserStatus = async function (id, status) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const editUserStatusResult = await activityDao.updateUserStatus(connection, id, status)
    connection.release();

    return response(baseResponse.SUCCESS);

  } catch (err) {
    logger.error(`App - editUserStatus Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}


exports.getUserFindById = async function (userId) {
  try {
    // 이메일 중복 확인
    const userInfo = await userProvider.findByUserId(userId);
    if (userInfo.length == 0) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

    return response(baseResponse.SUCCESS, userInfo);

  } catch (err) {
    logger.error(`App - getUserFindById Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.getUserFindByEmail = async function (email) {
  try {
    // 이메일 확인
    const userInfo = await userProvider.findByUserEmail(email);
    if (userInfo.length == 0) return errResponse(baseResponse.USER_USEREMAIL_NOT_EXIST);

    return response(baseResponse.SUCCESS, userInfo);

  } catch (err) {
    logger.error(`App - getUserFindByEmail Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

}