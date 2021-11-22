const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const activity = require("./activityDao");

//Provider : Read의 비즈니스 로직 처리
exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await activity.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

exports.nicknameCheck = async function (nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const nicknameCheckResult = await activity.selectUserNickname(
    connection,
    nickname
  );
  connection.release();

  return nicknameCheckResult;
};

exports.passwordCheck = async function (id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await activity.selectUserPassword(
      connection, id
  );
  connection.release();
  return passwordCheckResult[0];
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await activity.selectUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};

exports.findByUserId = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userInfoResult = await activity.selectUserInfo(connection, userId);
  connection.release();

  return userInfoResult[0];
};
