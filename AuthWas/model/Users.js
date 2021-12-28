
const mongoose = require('mongoose');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    email : {type:String , required: true , unique: true}
    ,hashed_password: {type:String , required: true , default: ' '}
    ,salt: {type:String , required: true}
    ,username: {type: String}
    ,role: {type:String , default:"USER"}
    ,createDt:{type:Date , default:Date.now}
});
const ObjectId = mongoose.Schema.ObjectId;



userSchema.virtual('password')
    .set(function(password){
       this.salt = this.makeSalt();
       this.hashed_password = this.encryptPassword(password);
       console.log(`virtual password 저장함 :`+this.hashed_password);
    })
    .get(function(){
       console.log('virtual password get() 호출됨..');
       return this._password;
    });


// 단방향 암호화를 만드는 함수...
userSchema.method('encryptPassword' , function(plainText , inSalt){
   if(inSalt){
       return crypto.createHmac('sha1' , inSalt).update(plainText).digest('hex');
   } else{
        return crypto.createHmac('sha1' , this.salt).update(plainText).digest('hex');
   }
});

//salt를 만드는 함수.
userSchema.method('makeSalt' , function(){
    return Math.round((new Date().valueOf() * Math.random()))+'';
});


//인증함수
userSchema.method('authenticate' , function(plainText , inSalt , hashed_password){
    if(inSalt){
        console.log(`authenticate 호출됨.. ${plainText}-->${this.encryptPassword(plainText , inSalt)} : ${hashed_password}`);
        return this.encryptPassword(plainText , inSalt) === hashed_password;
    }else{
        console.log(`authenticate 호출됨.. ${plainText}-->${this.encryptPassword(plainText)} : ${this.hashed_password}`);
        return this.encryptPassword(plainText) === this.hashed_password;
    }
});


const UsersModel = mongoose.model('users' , userSchema);

module.exports = UsersModel;