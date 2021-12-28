/**
 * Web Server
 */

const http = require('http');
/** express module */
const app = require('./app');
const path = require('path');
const mongoClient = require('./mod/mongo_client');


http.createServer(app).listen(process.env.PORT , ()=>{
    console.log(`ws listen ${process.env.PORT}...`);

    /** mongodb 연결 */
    mongoClient().connection();
});