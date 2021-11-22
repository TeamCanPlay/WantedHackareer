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


module.exports = {
    insertActivityVideo,
};
