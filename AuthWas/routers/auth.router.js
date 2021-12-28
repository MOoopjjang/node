/**
 * login / logout / registry
 *
 * @type {e | (() => Express)}
 */

const express = require('express');
const router = express.Router();
const logger = require('../mod/logging');
const UsersModel = require('../model/Users');
const authPassport = require('../mod/auth_passport');

/**
 * 로그인 화면
 */
router.get('/login' , (req , res , next)=>{
    res.render('login');
});

/**
 * 로그인 진행
 */
router.post('/login' ,authPassport.localAuthenticate());

/**
 * 가입화면
 */
router.get('/registry' , (req , res , next)=>{
   res.render('registry');
});

/**
 * 가입 진행
 */
router.post('/registry' , (req , res , next)=>{
    let user = new UsersModel({
         email:req.body.email
        ,password:req.body.password
        ,username:req.body.username
        ,role:'USER'
    });

    user.save((error)=>{
         if(error){
             logger.getLogger().info(`error : ${error}`);
            return res.redirect("/auth/registry");
        }

        res.redirect("/auth/login");
    });


});

/**
 * 로그아웃
 */
router.get('/logout' , (req, res , next)=>{
    req.session.destroy((err)=>{
       if(err){
           logger.getLogger().info(`로그아웃 에러 : ${err}`);
       }

       logger.getLogger().info('로그아웃');
       return res.redirect("/auth/login");
    });
});



//사용자 인증
function checkUser(_email , _pwd , done){
    UsersModel.findOne({email:_email}).exec((err , user)=>{
        if(err){
            done(err , null);
            return;
        }

        if( user){
            let u = new UsersModel({email:_email});
            let authenticated = u.authenticate(_pwd , user.salt , user.hashed_password);

            if(authenticated){
                logger.info('비밀번호 일치함.');
                done(null, user);
            }else{
                logger.info('비밀번호 일치하지 않음.');
                done(null, null);
            }
        }else{
            logger.error('step -error ');
            done(null, null);
        }
    });
}


module.exports = router;