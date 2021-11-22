const {pool} = require("../../../config/database");


//액티비티 동영상 insert
async function insertActivityVideo(connection, postActivityParams) {
    const insertActivityVideoQuery = `
        INSERT INTO ActivityVideo (videoUrl, comment, category, userIdx)
        VALUES (?, ?, ?, ?);
    `;
    const insertActivityVideoRows = await connection.query(insertActivityVideoQuery, postActivityParams);
    return insertActivityVideoRows;
}

//액티비티 동영상 가져오기
async function selectActivityVideo(connection, [page, limit]) {
    const selectActivityVideoQuery = `
        SELECT videoIdx,
               videoUrl,
               Users.userNickname,
               IFNULL(Users.userProfileImg, -1)                                                                  AS userProfileImg,
               comment,
               location,
               (SELECT count(userIdx)
                From VideoHeart
                WHERE status = 1
                  AND VideoHeart.videoIdx = ActivityVideo.videoIdx)                                              AS heartCount,
               (SELECT count(commentIdx)
                From VideoComment
                WHERE VideoComment.videoIdx = ActivityVideo.videoIdx)                                            AS reviewCount

        FROM ActivityVideo
                 INNER Join Users ON Users.userIdx = ActivityVideo.userIdx limit ?,?;
    `;
    const [selectActivityVideoRows] = await connection.query(selectActivityVideoQuery, [page, limit]);
    return selectActivityVideoRows;
}

module.exports = {
    insertActivityVideo,
    selectActivityVideo
};
