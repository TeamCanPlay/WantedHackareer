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

exports.postActivityVideo = async function (videoUrl, comment, userIdx,category,location) {
  try {

    const connection = await pool.getConnection(async (conn) => conn);
    const postActivityParams = [videoUrl, comment,category,userIdx,location]
    await activityDao.insertActivityVideo(connection,postActivityParams)
    connection.release();

    return response(baseResponse.SUCCESS);

  } catch (err) {
    logger.error(`App - postActivityVideo Service error\n: ${err.message} \n${JSON.stringify(err)}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};





