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
var images =[];
var i=0;



var storage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, './routes/Add/');
          //console.log(file);
      },  filename: function (req, file, cb) {
        cb(null, file.originalname);
        //console.log('origina'+file.originalname);
        var path1 =   './routes/Add/' + file.originalname;
        var path2 = path1;
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
        console.log('uploadAdd userId  '+req.body.userId);
    

       if(imagesPath.length==0){

        console.log('the photoes are not available');
       }else{

        for(i=0;i<imagesPath.length;i++){
            User.findByIdAndUpdate({_id:req.body.userId},
                {$addToSet:{'profileData.advertiesment':imagesPath[i]}},false,function(err,result){
                        if(err){
                            res.statusCode=500;
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
            imagesPath.length=0;

            getAllAdd(res,userDetail.userdetail.id);
       }
       




    });


    router.post('/getAdd',function(req,res){
        console.log('in the getadd api');
        console.log('get all add '+req.body.userId);
        getAllAdd(res,req.body.userId);


    });

    var getAllAdd =function(res,id){

        User.findById({_id:id},function(err,user){

                if(err){
                    res.statusCode =500;
                    console.log('err of the get all add');
                    
                    res.json({
                        success:false,
                        status:"err",
                        message:" cant get all add"


                    });

                }else{

                    
                    for(i=0;i<user.profileData.advertiesment.length;i++){
                        var base64str = base64_encode(user.profileData.advertiesment[i]);
                        images.push(base64str);
                        imagesPath.push(user.profileData.advertiesment[i]);
                        //console.log('this is add add in arry'+imagesPath[i]);

                    }
                    res.statusCode =200;
                    res.json({

                        success:false,
                        status:"succes",
                        id:user._id,
                        imgArray:images,
                        imgLinkArray:imagesPath


                    });
                    //console.log(imagesPath);
                    imagesPath.length=0;
                    images.length =0;

                }


        });
    }

    router.post('/deleteAddverticement',function(req,res){
        console.log('in the delete');
        var id =req.body.id;
        var url =req.body.url;
      
        
        User.findByIdAndUpdate({_id:id},{$pull :{'profileData.advertiesment':url}},function(err,result){
            
            if(err){
                    res.statusCode =404;
                console.log('Not user in delete advertice');
            }else{
                    res.statusCode=200;
                res.json({
                    succes:true,
                    status:"succes",
                    message:"succesfully deleted"

                });

            }

        });


    });

    

  
    module.exports.router =router;