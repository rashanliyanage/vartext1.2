var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var path = require('path');
var base64 = require('base-64');
var User =require('../models/user');
var userDetail =require('./users');
var multer = require('multer');
var  fs =require('fs');

var path2;
var imagesPath=[];
var i=0;



var storage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, './routes/Add/');
          //console.log(file);
      },  filename: function (req, file, cb) {
        cb(null, file.originalname);
        //console.log('origina'+file.originalname);
        var path1 =   './routes/picture/' + file.originalname;
      imagesPath.push(path1);
       
        
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

    router.post('/uploadAdd',upload.array("uploads[]", 12),function(req,res){
             
        console.log('inthe auploadApp api');
    

       if(imagesPath.length==0){

        console.log('the photoes are not available');
       }else{

        for(i=0;i<imagesPath.length;i++){
            User.findByIdAndUpdate({_id:userDetail.userdetail.id},
                {$addToSet:{'profileData.advertiesment':imagesPath[i]}},false,function(err,result){
                        if(err){
                            res.json({
                                success:false,
                                'status':"can,t add "

                            });
                            console.log('err upload add');
                        }else{
                    console.log('this is a saved photo'+result.profileData.advertiesment);
                        }
                });

                console.log('this is'+imagesPath[i]);
            }
       }
       imagesPath.length=0;




    });



  
    module.exports.router =router;