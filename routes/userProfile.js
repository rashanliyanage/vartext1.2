

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
var path2;




var storage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, './routes/picture/');
          //console.log(file);
      },  filename: function (req, file, cb) {
        cb(null, file.originalname);
        //console.log('origina'+file.originalname);
        var path1 =   './routes/picture/' + file.originalname;
     
       
        
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

router.post('/updateProfilePicture', upload.array("uploads[]", 12),function(req,res){
    console.log('in the upload api');
   // console.log('path'+path2);
   
   console.log(userDetail.userdetail.id);
    var newUser =new User();
    if(path2!=null){
            
            newUser.url=path2;
      
    
            User.findOneAndUpdate({_id:userDetail.userdetail.id}, {$set: {'profileData.profileurl':path2}},function(err,result){
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
        console.log('photo is '+ photo);
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



router.get('/getProfilePicture',function(req,res){
  console.log('in the get apofile picture api');
  User.findById(userDetail.userdetail.id,function(err,user){

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