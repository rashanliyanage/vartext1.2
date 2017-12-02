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
     
       console.log(path1);
        
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




router.post('/updateCoverPhoto',upload.array("uploads[]", 12),function(req,res){
    console.log(userDetail.userdetail.id);
    console.log('in the update cover ');
    
    if(path2!=null){
            
           
      
    
            User.findOneAndUpdate({_id:userDetail.userdetail.id}, {$set: {'profileData.coverurl':path2}},function(err,result){
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
    
    
    
      User.findOne({'profileData.coverurl':path2},function(err,photo){
      
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
    var base64str = base64_encode(photo.profileData.coverurl);
    
        res.statusCode = 200;
        res.json({
        
            id:userDetail.userdetail.id,
            url:photo.profileData.coverurl,
            img: base64str
          
          
          
        });
      }
    });
    }
    });
    }else{
    console.log('path null');
    
    }
   
    


})

module.exports.router2 =router;

