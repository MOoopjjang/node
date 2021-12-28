/**
 * 계시판 글
 *
 * @type {module:mongoose}
 */

const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
   title : {type:String , required:true}
    ,contents : {type:String , required:true}
    ,writer:{type:String , required:true}
    ,createDt:{type:Date , default : Date.now}
    ,updateDt:{type:Date , default : Date.now}
});
const ObjectId = mongoose.Schema.ObjectId;

const PostsModel = mongoose.model('posts' , postSchema);
module.exports = PostsModel;
