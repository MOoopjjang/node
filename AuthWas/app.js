/**
 * express ( mvc )
 */

const express = require('express');
const app = express();
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./configs/config');
const morgan = require('morgan');
const dotenv = require('dotenv');
const logger = require('./mod/logging');
const authPassport = require('./mod/auth_passport');


//---------------- profile 설정 ---------------------------------
/** 환경별 profile load */
let envFile = (process.env.NODE_ENV === 'local')?'configs/local.env':'configs/dev.env';
dotenv.config({path:path.join(__dirname , envFile)});


//---------------- express 설정 ---------------------------------
/** PORT 설정*/
app.set('PORT' , process.env.PORT || 8080);
/** view 설정 */
app.set('views' , path.join(__dirname , "views"));
app.set('view engine' , 'ejs');

//---------------- 미들웨어 사용 설정 ---------------------------------
/** body parsing 설정 */
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

/** express session 설정 */
app.use(expressSession({
    secret: process.env.COOKIE_SECRET
    ,resave : false
    ,saveUninitialized: true
    ,cookie:{
        httpOnly: true
        ,secure: false
    }
}));

/** passport module 설정 */
authPassport.init(app);


/** resource경로 설정 ( js , image , css ) */
app.use("/resources" , express.static(path.join(__dirname , "resources")));

/** logger 설정 */
logger.init();
app.use(morgan('combined' , {stream:logger.stream}));

//---------------- router 사용 설정 ---------------------------------
config.load_router(app);


/** 404 exception */
app.use((req , res , next)=>{
    const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    err.status = 404;
    next(err);
});

app.use((err , req , res,  next)=>{
   res.locals.message = err.message;
   res.locals.error = err.status;
   res.status(err.status || 500);
   res.render('error' , {status : err.status});
});


module.exports = app;