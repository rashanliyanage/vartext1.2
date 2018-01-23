

var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var Photo = require('../models/Photo');
var path = require('path');
var base64 = require('base-64');
var User =require('../models/user');
var userDetail =require('./users');
var multer = require('multer');
var  fs =require('fs');
var jwt = require('jsonwebtoken');
var path2;
var config =require('../config/user');




var storage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, './routes/Add/');
          //console.log(file);
      },  filename: function (req, file, cb) {
        cb(null, file.originalname);
        //console.log('origina'+file.originalname);
        var path1 =   './routes/Add/' + file.originalname;
     
       
        
        path2=path1;
       //console.log('path hii'+path2);
      }
    });


    
var upload = multer({ storage: storage });


        function base64_encode(file) {  //read imge file
        // read binary data
       // console.log(file);
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString('base64');
        }


// router.use((req,res,next)=>{

// const token =req.headers['authonticate'];
// if(!token){

// res.json({

//   message:'no provider'
// });

// }else{

// jwt.verify(token,config.secret,(err,decoded)=>{

// if(err){

// res.json({
// message:"token error"

// });

// }else{
//     req.decoded =decoded;
//     next();

// }

// })

// }

// });

// router.get('/test',function(req,res){

//   req.send(req.decoded);
// });


router.post('/updateProfilePicture', upload.array("uploads[]", 12),function(req,res){
    console.log('in the upload api');
    console.log('userid'+req.body.userId);
    var userId =req.body.userId;
   // console.log('path'+path2);
   
  //  console.log(userDetail.userdetail.id);
    var newUser =new User();
    if(path2!=null){
            
            newUser.url=path2;
      
    
            User.findOneAndUpdate({_id: userId}, {$set: {'profileData.profileurl':path2}},function(err,result){
                if(err){
                console.log(err);
                res.sendStatus=500;
                res.json(
                {
                    success:false,
                    "status": "err",
                     "message": "User not successfully created",
                });
    
    }else{
      res.statusCode =200;
      console.log('saved');
    
    
    
      User.findOne({'profileData.profileurl':path2},function(err,photo){
      
            if(err){
        res.statusCode = 404;
        res.json({
            success:false,
          "status": "error",
          "message": "404 Not Found"
        });
        console.log('photo err');
      } else{
        // console.log('photo is '+ photo);
    var base64str = base64_encode(photo.profileData.profileurl);
    
        res.statusCode = 200;
        res.json({
            success:true,
          "status": "success",
          "message": "fourd profile picture",
          
          photodata: base64str
          
        });
      }
    });
    }
    });
    }else{
    console.log('path null');
    
    }
   
    

});



router.post('/getProfilePicture',function(req,res){
  console.log('in the get apofile picture api');
  console.log('get user pro id'+req.body.userId);
  User.findById(req.body.userId,function(err,user){

            if(err){
                console.log('get profile picture err');
                statusCode=404;
                res.json({
                  success:true,
                  "status": "unsuccess",
                  "message": "not find profile picture",


                });

              
            }else if(user.profileData.profileurl==undefined){
              console.log('1st user');
              res.statusCode =404;
              res.json({
                photodata:'',
                success:false
              });
            }else {
              console.log('not gettin err on get profile picture');

              var base64str = base64_encode(user.profileData.profileurl);

                          
                    res.statusCode = 200;
                    res.json({
                        success:true,
                      "status": "success",
                      "message": "fourd profile picture",
                      
                      photodata: base64str
                      
                    });
            }

  })

});





module.exports=router;