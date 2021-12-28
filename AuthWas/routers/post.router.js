/**
 *
 */


const express = require('express');
const authentication = require('../mod/auth_passport');
const router = express.Router();
const PostsModel = require('../model/Posts');
const logging = require('../mod/logging');

router.all('/**' , authentication.isAuthenticated , (req , res , next)=>{
    next();
});

router.get('/write'  , (req , res , next)=>{
    res.render('post' , {info:req.user});
});


router.post('/writeproc' , (req , res , next)=>{

    console.dir(req.body);

    let post= new PostsModel({
       "title" : req.body.title
       ,"contents" : req.body.contents
        ,"writer" : req.user.email
    });

    post.save((err , p)=>{
        if(err){
            logging.getLogger().info(`error : ${err}`);
        }
        return res.redirect('/main/m')
    });
});


router.post('/delete'  , (req , res , next)=>{

    logging.getLogger().info(`delete ... ${req.body._id}`);

    PostsModel.deleteOne({_id:req.body._id} , (err)=>{
        if(err){
            logging.getLogger().info(`delete error : ${err}`);
            res.json({result:"FAILED"});
        }else{
             res.json({result:"SUCCESS"});
        }
    });
});


module.exports = router;