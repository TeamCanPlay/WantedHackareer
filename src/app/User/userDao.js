const { pool } = require("../../../config/database");

// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT userId, userNickname 
                FROM Users;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT userId
                FROM Users
                WHERE userId = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT id, email, nickname 
                 FROM UserInfo 
                 WHERE id = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 닉네임 체크
async function selectUserNickname(connection, nickname) {
  const selectNicknameQuery = `
                SELECT userNickname 
                FROM Users
                WHERE userNickname = ?;
                `;
  const [nicknameRows] = await connection.query(selectNicknameQuery, nickname);
  return nicknameRows;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO Users(userId, userPassword, userNickname)
        VALUES (?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 유저 레벨 생성
async function insertUserLevel(connection, userId) {
  const insertUserLevelQuery = `
        INSERT INTO Level (userId, level)
        VALUES (?, 1);
    `;
  const insertUserLevelRow = await connection.query(
    insertUserLevelQuery,
    userId
  );

  return insertUserLevelRow;
}

// 패스워드 체크
async function selectUserPassword(connection, id) {
  const selectUserPasswordQuery = `
    SELECT userIdx, userNickname, userPassword
    FROM Users
    WHERE userId = ?`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      id
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, id
        FROM UserInfo 
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
    selectUserAccountQuery,
    email
  );
  return selectUserAccountRow[0];
}

async function selectUserInfoByEmail(connection, email) {
  const selectUserQuery = `
  SELECT id, email, nickname
  FROM UserInfo 
  WHERE email = ?;`;
  const selectUserRow = await connection.query(selectUserQuery, email);
  return selectUserRow[0];
}

async function updateUserInfo(connection, id, nickname) {
  const updateUserQuery = `
  UPDATE UserInfo 
  SET nickname = ?
  WHERE id = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
  return updateUserRow[0];
}

async function updateUserStatus(connection, id, status) {
  const updateUserStatusQuery = `
  UPDATE UserInfo 
  SET status = ?
  WHERE id = ?;`;
  const updateUserStatusRow = await connection.query(updateUserStatusQuery, [
    status,
    id,
  ]);
  return updateUserStatusRow[0];
}

module.exports = {
  selectUser,
  selectUserEmail,
  selectUserId,
  selectUserNickname,
  insertUserInfo,
  insertUserLevel,
  selectUserPassword,
  selectUserAccount,
  selectUserInfoByEmail,
  updateUserInfo,
  updateUserStatus,
};
