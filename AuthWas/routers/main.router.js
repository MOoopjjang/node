
const express = require('express');
const moment = require('moment');
const router = express.Router();
const authPassport = require('../mod/auth_passport');
const PostsModel = require('../model/Posts');

/**
 * Login in 상태체크용 pre-router
 */
router.all('/**' , authPassport.isAuthenticated , (req , res , next)=>{
   next();
});


router.get('/m' , (req , res , next)=>{

    PostsModel.find({})
        .exec((err ,posts)=>{
            if(err){
                return res.render('error');
            }

            res.render('main' , {info:req.user , data:posts , moment : moment})
        });
});


router.get('/view/:id'  , (req , res , next)=>{
    PostsModel.findOne({_id:req.params.id})
        .exec((err , p)=>{
            if(err){
                return res.render('error');
            }

            console.dir(p);

            res.render('post_view' , {info:req.user , data:p , moment:moment});
        });
});


router.post("/search" , (req , res, next)=>{
    let searchText = req.body.searchText;
    logger.info(`search text : ${searchText}`);
    PostsModel.findOne({title:searchText})
        .exec((err , p)=>{
            res.json(p);
        });
});


module.exports = router;