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


var eventTheame =[];
var eventName =[];
var eventDiscription =[];

var storage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, './routes/Add/');
          //console.log(file);
      },  filename: function (req, file, cb) {
        cb(null, file.originalname);
        //console.log('origina'+file.originalname);
        var path1 =   './routes/Add/' + file.originalname;
     
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

router.post('/getCoverphoto',function(req,res){
console.log('in the get cover');
console.log('get cover photo id is '+req.body.userId);
getCoverPoto(req.body.userId,res);


})


var getCoverPoto = function(id,res){


User.findById({_id:id},function(err,user){


        if(err){
            statusCode =500;
            res.json({
                    success:false,
                    status:" internal server err"


            });
        } else if(!user){

            res.statusCode =404;
            res.json({
                success:false,
                status:" user not found",


            });
        } else{
            if(user.profileData.coverurl==undefined){

                res.statusCode =404;
                res.json({
                    id:user._id,
                    img:''

                });
            } else{

            var base64str = base64_encode(user.profileData.coverurl);
            res.statusCode =200;
            res.json({

               
                id:user._id,
                img:base64str
        });

    }



}
});
}


router.post('/updateCoverPhoto',upload.array("uploads[]", 12),function(req,res){
    
    console.log('in the update cover ');
    console.log(req.body.userId);
    
    if(path2!=null){
            
           
      
    
            User.findOneAndUpdate({_id:req.body.userId}, {$set: {'profileData.coverurl':path2}},function(err,result){
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

var getEditAbout =function(id,res){
    
    console.log('in the get about api');
        User.findById({_id:id},function(err,result){
    
            if(err){
    
                res.statusCode =500;
                res.json({
                    suscces:false,
                    message:'err get about data'
    
    
                });
            } else if(!result.aboutDetail){
    
                console.log('not foud about data');
    
            } else {
    
                res.statusCode =200;
                res.json({
                    name:result.aboutDetail.name,
                    email:result.aboutDetail.email,
                    address:result.aboutDetail.address,
                    phoneNumber:result.aboutDetail.phoneNumber,
                    qualification:result.aboutDetail.qualification,
                    expirience:result.aboutDetail.experience
    
    
                });
    
            }
    
    
        });
    
    }
    

router.post('/submitAbout',function(req,res){

    console.log('in the submitAbout Api');
    var name =req.body.name;
    console.log(req.body.userId);
    console.log(name);
    var email =req.body.email;
    var phoneNumber =req.body.phoneNumber;
    var address =req.body.address;
    var qualification =req.body.qualification;
    var expirience =req.body.expirience;

    User.findByIdAndUpdate({_id:req.body.userId}, {$set: {
        'aboutDetail.name':name,
        'aboutDetail.email':email,
        'aboutDetail.phoneNumber':phoneNumber,
        'aboutDetail.address':address,
        'aboutDetail.qualification':qualification,
        'aboutDetail.experience':expirience

    
    }}, function(err,result){

        if(err){
            res.statusCode =500;
            console.log('in err edite about');
            res.json({

                success:false,
                message:"error edit about"

            });


        } else {
          getEditAbout(req.body.userId,res);

        }



    });



});

router.post('/getEditAbout',function(req,res){
    console.log('get edit about');
    console.log(req.body.userId);
getEditAbout(req.body.userId,res);
    


});

router.post('/uploadEventPhoto',upload.array("uploads[]", 12),function(req,res){

console.log('in the event');

    if(path2!=null){
        
        User.findByIdAndUpdate({_id:userDetail.userdetail.id}, 
            {$addToSet: {
                
                'profileData.myevent.eventtheamurl':path2 
            }},function(err,result){
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



}
});
}else{
console.log('path null');

}


});

function EventDetail(){




}



router.post('/uploadEventData',function(req,res){
    
    console.log('in the eventData');
        var eventDiscription = req.body.eventdiscription;
        var eventName = req.body.eventname;
    
     
       
            
            User.findByIdAndUpdate({_id:userDetail.userdetail.id}, 
                {$addToSet: {
                    'profileData.myevent.eventname':eventName,
                    'profileData.myevent.eventdiscription':eventDiscription,
                   
                }} ,function(err,result){
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
    
    res.json({
        
                                success:true,
                                EventTheamArray:eventTheame,
                                eventNameArray: eventName,
                                eventDiscriptionArray:eventDiscription
        
                            });
        
    
    

    }
    });
    
    
    
    });

    var getEvent = function(id,res){


            User.findById({_id:id},function(err,result){

                if(err){

                    console.log('error in get event');
                    res.statusCode = 500;
                    res.json({

                        success:false,
                        message:"error in get event"

                    });

                }else{
                    for(var i=0;i<result.profileData.myevent.eventname.length;i++){
                        console.log((result.profileData.myevent.eventtheamurl[i]));
                        if(result.profileData.myevent.eventtheamurl[i]!= undefined){
                        var base64str = base64_encode(result.profileData.myevent.eventtheamurl[i]);
                        eventTheame.push(base64str);
                        }
                        eventName.push(result.profileData.myevent.eventname[i]);
                        eventDiscription.push(result.profileData.myevent.eventdiscription[i]);
                    
                    }

                    res.statusCode =200;
                    res.json({

                        success:true,
                        EventTheamArray:eventTheame,
                        eventNameArray: eventName,
                        eventDiscriptionArray:eventDiscription

                    });

                    eventTheame.length =0;
                    eventName.length =0;
                    eventDiscription.length =0;
                }


            });

    }

    router.get('/getEvent',function(req,res){
        getEvent(userDetail.userdetail.id,res);

    });

module.exports.router2 =router;

