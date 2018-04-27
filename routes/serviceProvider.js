var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var path = require('path');
var base64 = require('base-64');
var User =require('../models/user');
var userDetail =require('./users');
var multer = require('multer');
var  fs =require('fs');
var Event = require('../models/eventSchema');

var path2;
var imagesPath=[];
var images =[];
var i=0;
var path4;



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


            /////////////////////////////////////////////////////
            var StorageForAdz = multer.diskStorage({
                destination: function(req, file, callback) {
                    callback(null, "./routes/Add/");
                },
                filename: function(req, file, callback) {
                    callback(null,file.originalname);
                    path3 =  'http://192.168.8.100:3000/Add/'+ file.originalname;
                    path4 = './routes/Add/' + file.originalname;
                    console.log('path'+path3);
                }
              });
        
              
              var uploadAdzPhoto = multer({
                storage: StorageForAdz
              }).array("adzPic", 5);
//////////////////////////////////////////////////////

router.post('/createadzforsupplier',function(req,res){
    
        uploadAdzPhoto(req, res, function(err){
            var id = req.body.id;

            if (err) {
                res.json({status: 0, message: err});
            }else{

            User.findOneAndUpdate({_id:id},{
                
                $push:{adz:{
                    adzname :req.body.adzname,
                    priceforservice :req.body.priceforservice,
                    adzdescription :req.body.adzdescription,
                    contactnumbers :req.body.contactnumbers ,
                    adzpicurl:path3,
                    picurl:path4
                    
                 } }
            }, function(err, user) { 
                if (err) {
                    res.json({status: 0, msg: err});
                }else{  
                 res.json({msg:"success",
                 imgurl: user.imgurl,
                 id:user._id,
                 fname:user.firstname});
                 }
        
            });
        }
        });     
});


///////////////////////////////////////////////


router.post('/getadzdata',function(req,res){
    var id = req.body.id;
    User.findOne({_id:id}, function(err, user){
        if (err) {
            res.json({status: 0, msg: err});
        }else{
            
         res.json({"adz":user.adz});
         }
    });
});

///////////////////////////////////

router.post('/selecteduser',function(req,res){
    var id = req.body.id;
    User.findOne({_id:id},function(err,user){
        if(err){
            throw err;
        }else{
            res.json({
                msg:"success",  
                id:user._id,
                fname:user.firstname,
                lname:user.lastname,
                imgurl:user.imgurl
            });
        }
    });
});

///////////////////////////////////////

router.post('/getsearchserviceproviders',function(req,res){
    var spType = req.body.eventId;
    User.find({spCatagory:spType,usertype:"service_provider"},function(err,user){
        if(err){
            throw err;
        }else{
            res.json({"users":user});
        }
    });
});


//////////////////////////////////////////




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

            getAllAdd(res,req.body.userId);
       }
       




    });


    router.post('/addserviceproviers',function(req,res){
        var organizername= req.body.organizerName;
        var organizerId = req.body.organizerId;
        var eventId  = req.body.eventId;
    
        Event.findOneAndUpdate({_id:eventId},{$addToSet:{servieceProvider:organizerId}},function(err, user){
            if (err) {
                res.json({status: 0, msg: err});
            }else{
             res.json({msg:"success"});
             }
    
        });
    });



    router.post('/getaddserviceproviders',function(req,res){
        var eventId  = req.body.eventId;
       
        Event.findById({_id:eventId}).populate('servieceProvider', 'firstname lastname _id imgurl spCatagory').exec(function(err,event){
            if (err) {
                res.json({status: 0, msg: err});
            }else{
               
                res.json({"organizers": event.servieceProvider});             
                }
        });
    });


    router.post('/deletesupplierproviders', function(req,res){
        var eventId = req.body.eventId;
        var organizerId = req.body.organizerid;
    
        Event.findOneAndUpdate({_id:eventId},
        {$pull:{servieceProvider:organizerId}},
        function(err, user) { 
            if (err) {
                res.json({status: 0, msg: err});
            }else{  
             res.json({msg:"success"});
             }
    
        });
    
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
                    if(user.profileData.advertiesment.length !=0){
                    
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
                }else{

                    console.log('profile data nul');
                }

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