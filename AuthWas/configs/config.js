

const routerInfos = [
  /*  {mapping:"/tst" , path:"../routers/test.router"}*/
    {mapping:"/auth" , path:"../routers/auth.router"}
    ,{mapping:"/main" , path:"../routers/main.router"}
    ,{mapping:"/post" , path:"../routers/post.router"}
];

module.exports = {

    load_router : (app)=>{
        routerInfos.forEach((info)=>{
            /** express에 router 등록 */
            app.use(info.mapping , require(info.path));
        });
    }
}