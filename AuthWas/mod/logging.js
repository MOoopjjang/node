/**
 * winston logging module
 *
 * @type {winston}
 */
const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');

let logger , logDir;


function loggingInit(){
    let { combine , timestamp , printf} = winston.format;
    let logFormat = printf(info=>{
        return `[${info.timestamp}:${info.level}]:${info.message}`;
    });
    logDir = process.env.LOG_DIR;

    /**
     * Log Level
     * error:0 , warn:1 , info:2 , http:3 , verbose:4 , debug:5 , silly:6
     */
    logger = winston.createLogger({
        format:combine(
            timestamp({
                format:'YYYY-MM-DD HH:mm:ss'
            }),logFormat
        )
        ,transports:[
            //info 레벨로그를 저장할파일 설정
            new winstonDaily({
                level:'info'
                ,datePattern:'YYYY-MM-DD'
                ,dirname:logDir
                ,filename:`%DATE%.log`
                ,maxFiles:30
                ,zippedArchive:false
            })
            //error 레벨로그를 저장할파일 설정
            ,new winstonDaily({
                level:'error'
                ,datePattern:'YYYY-MM-DD'
                ,dirname:logDir
                ,filename:`%DATE%.error.log`
                ,maxFiles:30
                ,zippedArchive:false
            })
        ]
    });


    /** 상용환경이 아닐경우 ( local , dev ) */
    if(process.env.NODE_ENV !== 'prod'){
        logger.add(new winston.transports.Console({
            format:winston.format.combine(
                winston.format.colorize()
                ,winston.format.simple()
            )
        }));
    }

    /** morgan 미들웨어와 연동 */
    logger.stream = {
        write:(message , encoding)=>{
            logger.info(message);
        }
    };
}


module.exports = {
    init : ()=>{loggingInit();}
    ,getLogger : ()=>{ return logger; }
};