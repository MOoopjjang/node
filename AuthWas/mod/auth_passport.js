
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const UsersModel = require('../model/Users');


//사용자 인증에 성공했을 때 호출 ( session write )
passport.serializeUser(function(user , done){
    console.log('serializeUser() 가 호출됨.');
    console.dir(user);

    /**
     * session write
     */
    done(null , user);
});

//사용자 인증 이후 사용자 요청이 있을 때마다 호출 ( session read )
passport.deserializeUser(function(user , done){
     console.log('deserializeUser() 가 호출됨.');
    console.dir(user);
    /**
     * session read
     */
    done(null , user);
});


//view page에 form field중 로그인과 연관된 field 설정 ( "email" , "password")
passport.use('local-login' , new LocalStrategy({
       usernameField : "email",
       passwordField : "password",
       passReqToCallback: true
} , function(req , email , password , done){
    console.log(`local-login 호출됨 email : ${email} , password : ${password}`);
    UsersModel.findOne({email:email}).exec((err , user)=>{
        if(err){
            return done(err);
        }

        if( user){
            let u = new UsersModel({email:email});
            let authenticated = u.authenticate(password , user.salt , user.hashed_password);

            if(authenticated){
                console.log('비밀번호 일치함.');
                return done(null, user);
            }else{
                console.log('비밀번호 일치하지 않음.');
                return done(null, null);
            }
        }else{
            return done(null , false , req.flash('loginMessage' , '등록된 계정이 없습니다.'));
        }
    });
}));

module.exports = {
    //미들웨어 추가
    init : (_app)=>{
        _app.use(passport.initialize());
        _app.use(passport.session());
        _app.use(flash());
    },
    //로그인 성공및 실패에 따른 분기
    localAuthenticate:()=>{
        return passport.authenticate("local-login" , {
            successRedirect : "/main/m",
            failureRedirect : "/auth/login"
            ,failureFlash: true
        })
    },
    //현재 로그인상태 인지 체크
    isAuthenticated : (req , res , next)=>{
        if(req.isAuthenticated()){
            return next();
        }
        return res.redirect("/auth/login");
    }
}




