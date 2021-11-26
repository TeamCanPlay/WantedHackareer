const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
let cors = require('cors');
module.exports = function () {
    const app = express();

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());

    /* App (Android, iOS) */
    require('../src/app/User/userRoute')(app);
    require('../src/app/Activity/activityRoute')(app);

    return app;
};