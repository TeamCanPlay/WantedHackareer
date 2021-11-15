const jwtMiddleware = require("../../../config/jwtMiddleware");
const regexEmail = require("regex-email");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");
const { emit } = require("nodemon");

/** 회원가입 API
 * [POST] /users
 * body : id, passsword, nickname
 */
exports.postUsers = async function (req, res) {
  const { id, password, nickname } = req.body;

  if (!id) return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
  if (id.length > 30)
    return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
  /*if (!regexEmail.test(id))
    return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));*/
  if (!password) return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
  if (password.length < 6 || password.length > 20)
    return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
  if (!nickname) return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));
  if (nickname.length > 20)
    return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));

  const signUpResponse = await userService.createUser(
    id,
    password,
    nickname
  );

  return res.send(signUpResponse);
};

/** 로그인 하기 API
 * [POST] /user/login
 * body : id, passsword
 */
exports.login = async function (req, res) {
  const { id, password } = req.body;

  if (!id) return res.send(errResponse(baseResponse.SIGNIN_EMAIL_EMPTY));
  if (id.length > 30)
    return res.send(errResponse(baseResponse.SIGNIN_EMAIL_LENGTH));
  /*
  if (!regexEmail.test(id))
    return res.send(errResponse(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));
   */
  if (!password)
    return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_EMPTY));

  const signInResponse = await userService.postSignIn(id, password);

  return res.send(signInResponse);
};

/** JWT 토큰 검증 API
 * [GET] app/users/check
 */
exports.check = async function (req, res) {
  const userIdx = req.verifiedToken.userIdx;
  const userNickname = req.verifiedToken.userNickname;
  console.log(userIdx);
  console.log(userNickname);
  return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS,{userIdx,userNickname}));
};

/** 회원 전체 조회 API
 * [GET] /app/users
 *
 * 회원 이메일 검색 조회 API
 * [GET] /app/users?word=
 * queryString : word
 */

exports.getUsers = async function (req, res) {
  const email = req.query.word;
  if (!email) {
    const userListResult = await userProvider.retrieveUserList();
    return res.send(res.send(response(baseResponse.SUCCESS, userListResult)));
  } else {
    const userListByEmail = await userProvider.retrieveUserList(email);
    return res.send(res.send(response(baseResponse.SUCCESS,userListByEmail)));
  }
};











/** 회원 조회 API
 * [GET] /app/users/:userId
 * pathVariable : userId
 */
exports.getUserById = async function (req, res) {

  const userIdToToken = req.verifiedToken.userInfo
  const userId = req.params.userId;

  if(userIdToToken != userId) {
    res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
  } else {
    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(res.send(response(baseResponse.SUCCESS, userByUserId)));
  }
};

/** 회원 정보 수정 API
 * [PATCH] /app/users/:userId
 * pathVariable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

  const userIdToToken = req.verifiedToken.userInfo
  const userId = req.params.userId;
  const nickname = req.body.nickname;

  if(userIdToToken != userId) {
    res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
  } else {
    if(!nickname) res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));
    const editUserInfo = await userService.editUser(userId, nickname)
    return res.send(editUserInfo);
  }
};

/** 회원 상태 수정 API
 * [PATCH] /app/users/:userId/status
 * body : status
 */
exports.patchUserStatus = async function (req, res) {

  const userIdToToken = req.verifiedToken.userInfo
  const userId = req.params.userId;
  const status = req.body.status;
  
  if(userIdToToken != userId) {
    res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
  } else {
    if(!status) res.send(errResponse(baseResponse.USER_STATUS_EMPTY));
    const editUserStatus = await userService.editUserStatus(userId, status)
    return res.send(editUserStatus);
  }
  
};
