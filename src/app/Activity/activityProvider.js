const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const activity = require("./activityDao");

exports.getActivityVideo = async function (page, limit) {
  const connection = await pool.getConnection(async (conn) => conn);
  const activityVideoResult = await activity.selectActivityVideo(connection, [page, limit]);
  connection.release();

  return activityVideoResult;
};

