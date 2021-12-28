/***
 * user정보를 cache에 저장 / 조회 /삭제 하는 module
 *
 * @type {{}}
 */

const authCache = {};



module.exports = {
    save : (user)=>{
        if( user.email in authCache){
            console.log(`${user.email} 은 이미 등록된 user입니다.`);
            return;
        }

        authCache[user.email] = user;
    }
    ,find:(_email , _pwd)=>{
        if( _email in authCache){
            let user = authCache[_email];
            if(_pwd === user.password){
                return user;
            }
        }
        return null;
    }
    ,remove: (_email)=>{
        if( _email in authCache){
           delete authCache[_email];
        }
    }
}