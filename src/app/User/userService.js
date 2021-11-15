const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");
const { connect } = require("http2");

// Service Create, Update, Delete 의 로직 처리
exports.createUser = async function (id, password, nickname) {
  try {
    // 이메일 중복 확인
    const emailRows = await userProvider.emailCheck(id);
    if (emailRows.length > 0) return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

    // 닉네임 중복 확인
    const nicknameRows = await userProvider.nicknameCheck(nickname);
    if (nicknameRows.length > 0)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);

    // 비밀번호 암호화
    const hashedPassword = await crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");

    const insertUserInfoParams = [id, hashedPassword, nickname];

    const connection = await pool.getConnection(async (conn) => conn);
      try {
        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        connection.release();
        return response(baseResponse.SUCCESS);

      } catch (err) {
        connection.release();
        logger.error(`App - createUser error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
      }
  } catch (err) {
    logger.error(`App - createUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.postSignIn = async function (email, password) {
  try {
     // 이메일 확인
     const emailRows = await userProvider.emailCheck(email);
     if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG)

     const selectEmail = emailRows[0].email

     const hashedPassword = await crypto
     .createHash("sha512")
     .update(password)
     .digest("hex");

     // 비밀번호 확인
     const selectUserPasswordParams = [selectEmail, hashedPassword];
     const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);

     if (passwordRows[0].password !== hashedPassword) {
       return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
      }

    // 계정 상태 확인
    const userInfoRows = await userProvider.accountCheck(email);

    if (userInfoRows[0].status === "INACTIVE") {
      return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
    } else if (userInfoRows[0].status === "DELETED") {
      return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
    }

    console.log(userInfoRows[0].id)
    //토큰 생성 Service
    let token = await jwt.sign(
      {
        userInfo: userInfoRows[0].id,
      }, // 토큰의 내용(payload)
      secret_config.jwtsecret, // 비밀 키
      {
        expiresIn: "365d",
        subject: "userInfo",
      } // 유효 시간은 365일
    );

    return response(baseResponse.SUCCESS, token);

  } catch (err) {
    logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.editUser = async function (id, nickname) {
  try {
    console.log(id)
    const connection = await pool.getConnection(async (conn) => conn);
    const editUserResult = await userDao.updateUserInfo(connection, id, nickname)
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
    const editUserStatusResult = await userDao.updateUserStatus(connection, id, status)
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