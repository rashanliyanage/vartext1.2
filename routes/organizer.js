

var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var Event = require('../models/eventSchema');
var userDetail = require('./users');
const bcrypt = require('bcryptjs');
var User = require('../models/user');
var fs = require('fs');
var multer = require('multer');
var base64 = require('base-64');
var async = require('async');
var nodemailer = require('nodemailer');
var Cryptr = require('cryptr'),
cryptr = new Cryptr('myTotalySecretKey');
var path2;
var path4;




var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './routes/Add/');
        //console.log(file);
    }, filename: function (req, file, cb) {
        cb(null, file.originalname);
        //console.log('origina'+file.originalname);
        var path1 = './routes/Add/' + file.originalname;
        path2 = path1;
        path4 =  'http://192.168.1.101:3000/Add/'+ file.originalname;
        console.log(path2);
      


        // path2 = path1;
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


module.exports.currentEvent = currentevent = {
    currenteventid: '',

}
function base64_encode(file) {  //read imge file
    // read binary data
    // console.log(file);
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}


router.post('/getaddedorganizsers',function(req,res){
    console.log('in the get added orgnizer');
    var eventId  = req.body.eventId;
    Event.findById({_id:eventId}).populate('organizer', 'firstname lastname _id profileData.profileurl').exec(function(err,event){
        if (err) {
            res.json({status: 0, msg: err});
        }else{
            console.log(event.organizer);
            event.organizer.forEach(function(organizer){
                var base64 = base64_encode(organizer.profileData.profileurl);
               
                organizer.profileData.profileurl =base64;

            });
         
            res.json({"organizers" : event.organizer});             
            }
    });
})

router.get('/getpublicevent',function(req,res){


    Event.find({eventType:'public'},'BroadcastEvent eventlocation',function(err,event){

         
          //  console.log(event);
            event.forEach(function(event){

                console.log(event.BroadcastEvent.eventPictureUrl)
                var base64 =base64_encode(event.BroadcastEvent.eventPictureUrl);
                event.BroadcastEvent.eventPictureUrl =base64;
               
            });
            res.json({
                event:event,
            

            });

    })





});


router.post('/email',function(req,res){
    var senderemail =req.body.youremail;
    var recieveremail =req.body.recieveremail;
    var senderpassword =req.body.yourPassword;
    var subject = req.body.subjectOfthEmai;
    var contennt = req.body.contentoftheEmail;

    console.log('in send email api');


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        secure:false,
        port:25,
        auth: {
               user:senderemail ,
               pass: senderpassword
           },tls:{
               rejectUnauthorizide:false
               
    
           }
       })
    
       const mailOptions = {
        from: senderemail, // sender address
        to: recieveremail, // list of receivers
        subject: subject, // Subject line
        html: contennt// plain text body
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if(err){
          console.log(err);
          res.statusCode =500;
          res.json({
            succes:500

          });
        }else{
            res.statusCode=200;
            res.json({
                succes:200

            });
          console.log('succes fully send');

        }
     });
    

});

router.post('/broadcastEvent',upload.array("uploads[]","id", 12),function(req,res){
console.log('in th broadcast');

console.log(req.body.id);
console.log(req.body.eventname);
console.log(req.body.eventdiscription);
console.log(req.body.eventDate);
console.log(req.body.eventTime);
console.log(req.body.eventType);
var evnentid =req.body.id;
var eventname =req.body.eventname;
var eventdiscription =req.body.eventdiscription;
var eventTime =req.body.eventTime;
var eventDate =req.body.eventDate;
var eventType = req.body.eventType;

console.log(path2);

Event.findByIdAndUpdate({_id:evnentid}, {$set: {
       'BroadcastEvent.eventname':eventname,
       'BroadcastEvent.eventDiscription':eventdiscription,
       'BroadcastEvent.eventPictureUrl':path2,
       'BroadcastEvent.date':eventDate,
       'BroadcastEvent.time':eventTime,
       'BroadcastEvent.eventType':eventType,
       'Date':eventDate,
       'eventType':eventType,
       'eventDiscription':eventdiscription,
       'imgurl':path4,
       'time':eventTime

    
    }},function(err,event){


        if(err){
            console.log('erro');

            res.statusCode =500;
            res.json({

                succes:false,
                messge:'enternal server error'


            });

        }else if(!event){

            console.log('not found');
            res.statusCode =404;

            res.json({
                succes:false,
                message:'not found event',



            });
        }else{
            console.log('success');
            res.statusCode =200;
            res.json({

                succes:true,
                message:'success publish event'


            });


        }


    });


});


var organizerdetailArray =function(id,name){

this.id =id;
this.name =name;
//this.img =img;

}

var existOrganizerArray =[];
    router.post('/deleteorganizer',function(req,res){
        console.log('in the delete organzer');
        

        var eventid = req.body.eventId;
        var organizer = req.body.selectedorganizerId;
        console.log(this.eventid);
        console.log(organizer);

        Event.findOneAndUpdate({_id:eventid},{$pull :{'organizer':organizer}},{new:true},function(err,event){

            console.log(event);
            if(err){
                throw err
                console.log('error delete array');
            }else{
                console.log('success delete array');

        
            }


        });



    });

   

router.post('/createvent2',upload.array("uploads[]","id", 12),function(req,res){
    var newEvent = new Event();
    console.log('in the create event 2');
    var userid =req.body.id;
    var password =req.body.password;
   
    
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) { console.log('err') } else {
                newEvent.Date =req.body.edate,
                newEvent.time = req.body.etime,
                newEvent.eventType =req.body.eventType;
                newEvent.imgurl =path4;
                newEvent.eventDiscription =req.body.edescription;
                newEvent.adminorganizer=req.body.id;
                newEvent.password =hash;
                newEvent.pass =password;
                newEvent.eventname =req.body.ename;
            
            
               
            ////////////////////////
                newEvent.BroadcastEvent.eventType =req.body.eventType;
                newEvent.BroadcastEvent.eventname =req.body.ename;
                newEvent.BroadcastEvent.eventDiscription =req.body.edescription;
                newEvent.BroadcastEvent.eventPictureUrl =path2;
                newEvent.BroadcastEvent.date =req.body.edate;
                newEvent.BroadcastEvent.time= req.body.etime;
            
            }
            
            newEvent.save(function (err, resule) {

                if (err) {
                    res.statusCode = 500;
                    res.json({
                        success: false,
                        message: 'err register event'


                    });

                } else {
                    User.findById({_id:userid},function(err,user){
                        
                                    if(err){
                                        console.log('error');
                        
                                    }else {
                                        console.log('succes create event');
                                    res.json({msg:"success",
                                    imgurl: user.imgurl,
                                    id:user._id,
                                    fname:user.firstname});
                                    }
                           
                        
                                   });
                }


            });



        });
    })


    
            
});


router.post('/geteventdata',function(req,res){
    var id = req.body.id;
    Event.find({adminorganizer:id}, function(err, event){
        if (err) {
            res.json({status: 0, msg: err});
        }else{
          console.log('show event');  
          console.log(event);
         res.json({"events":event});
         
         }


    });
});


router.post('/addedorganizsers',function(req,res){
    var organizerId = req.body.organizerId;
    var eventId  = req.body.eventId;

    Event.findOneAndUpdate({_id:eventId},{$set:{organizer:organizerId}},function(err, user){
        if (err) {
            res.json({status: 0, msg: err});
        }else{
         res.json({msg:"success"});
         }


    });
});


router.post('/getaddedorganizsers',function(req,res){
    var eventId  = req.body.eventId;
    var oranizersArray = [];

    Event.find({_id:eventId},function(err,event){
        if (err) {
            res.json({status: 0, msg: err});
        }else{
            event.organizer.forEach(function(oranizerid){
                User.find({_id:event.organizer},function(err,user){
                    if(err){
                        throw err;
                       
                    }else{
                        oranizersArray.push({"organizerid":user._id,"organizername":user.firstname+user.lastname});
                    }
                });

                
            });
         }
        

    });
});






router.post('/addServieceProvider',function(req,res){
    console.log('in the add service provider');
    var id = req.body.selectedorganizerId;
    var senderemail =req.body.senderemail;
    var password =req.body.senderpassword;
    console.log(senderemail);
    console.log(password);
    console.log('id is '+id);
    var eventid = req.body.eventId;

    Event.findByIdAndUpdate({_id:eventid}, {$addToSet: {'servieceProvider':id}},function(err,result){;

    if(err){
        console.log();

        console.log('error in add service proveider');
        res.statusCode = 500;
        res.json({

            success: false,
            message: 'server error'



        });


    }else {
        console.log('success add service provider');

        console.log('success add');
        res.statusCode = 200;
        res.json({
            success: true,
            message: 'success add'

        });

            sendEmailToServiceProvider(id,eventid,senderemail,password,res);
    }


});
});

var  sendEmailToServiceProvider =function(id,eventid,senderemail,password,res){
    console.log('in the send email api');

Event.findById({_id:eventid})
.populate({
    path:'servieceProvider',
    match: {_id:id},
    select:'email'

}).exec(function(err,event){

    if(err){
        throw err;

    }else{
console.log(event.servieceProvider[0].email);
console.log(event.eventname);
console.log(event.pass);


                sendemail(event.servieceProvider[0].email, event.eventname, event.pass, senderemail,password,res);


            }

});
}



                var sendemail =function(recieveremail,eventname,eventpassword,senderemail,emailpassword,res){



                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        secure:false,
                        port:25,
                        auth: {
                               user:senderemail ,
                               pass: emailpassword
                           },tls:{
                               rejectUnauthorizide:false
                               
                    
                           }
                       })
                    
                       const mailOptions = {
                        from: senderemail, // sender address
                        to: recieveremail, // list of receivers
                        subject: 'you added chat froup  ', // Subject line
                        html: 'log to chat using password->'+eventpassword+'and eventname->'+eventname// plain text body
                      };
                      transporter.sendMail(mailOptions, function (err, info) {
                        if(err){
                          console.log(err);
                          res.statusCode =500;
                          res.json({
                            succes:500
                
                          });
                        }else{
                            res.statusCode=200;
                            res.json({
                                succes:200
                
                            });
                          console.log('succes fully send');
                
                        }
                     });



                }
router.post('/addorganizers', function (req, res) {
    console.log('in the add organizer');

    var id = req.body.selectedorganizerId;
    var eventid = req.body.eventId;
    var addOrganizer = req.body.addeduser;
    console.log(id);
    Event.findByIdAndUpdate({ _id: eventid }, { $addToSet: { 'organizer': id } }, function (err, result) {


        if (err) {

            console.log('error in add orgnizer');
            res.statusCode = 500;
            res.json({

                success: false,
                message: 'server error'



            });

        } else {

            generateAddNotification(addOrganizer, id, result.eventname, eventid);
            console.log('success add');
            res.statusCode = 200;
            res.json({
                success: true,
                message: 'success add'

            });
        }



    });

});

var notificationObject = function (notification, addedevent, date, addedorganizer) {
    this.notification = notification;
    this.addedevent = addedevent;
    this.date = date;
    this.addedorganizer = addedorganizer;
}

var generateAddNotification = function (addOrganizerId, selectedorganizerId, eventname, addedeventaId) {

    console.log('create noti');
    User.findById({ _id: addOrganizerId }, function (err, result) {

        if (err) {

            console.log('server err in noti api');

        } else {

            var notification = 'you are added by' + result.firstname + ' ' + result.lastname + ' ' + 'to' + ' ' + eventname + ' ' + 'event';
            console.log(notification);
            var newNotifictionObj = new notificationObject();
            var datetime = new Date();
            newNotifictionObj.date = datetime;
            newNotifictionObj.addedevent = addedeventaId;
            newNotifictionObj.notification = notification;
            newNotifictionObj.addedorganizer = addOrganizerId;


            User.findByIdAndUpdate({ _id: selectedorganizerId }, {
                $addToSet: {
                    'notification': newNotifictionObj


                }
            }, function (err, resule) {
                if (err) {
                    console.log('error save notification');

                } else {

                    console.log('success saved notifivation');

                }




            });
        }


    });


}

router.post('/getCoordinats',function(req,res){
    console.log('in the getCoordinats ');
    var eventId = req.body.eventId;
    console.log( 'here'+eventId);

    
        Event.findById({_id:eventId},function(err,result){

            if(err){
                    console.log('error get coords');
                    res.statusCode =500;
                    res.json({

                        success:false,
                       



                    });



            }else{

                    if(result.eventlocation==null){

                        console.log('event location is undifined');
                    }else{
                console.log('succes get coords');

                  res.json({

                        success:true,
                        lat:result.eventlocation.lat,
                        lng:result.eventlocation.lng



                    });
                }

            }


        });


});

router.post('/setCoordinats',function(req,res){
    var lat =req.body.lat;
    var lng = req.body.lng;
    var eventId = req.body.eventId;
    console.log(lat);
    Event.findByIdAndUpdate({_id:eventId},{$set: {
        'eventlocation.lat':lat,
        'eventlocation.lng':lng
    }},function(err,result){
        if(err){

            console.log('err set locations');
            res.statusCode =500;
            res.json({

                success:false,


            });

        }else {
            console.log('succes update event');
            res.statusCode =200;
            res.json({

                success:true


            });




        }




    });
  


});



var sentNotificationObj = function (notification, eventid,addedorganizerpropic) {

    this.notification = notification;
    this.eventid = eventid;
this.addedorganizerpropic = addedorganizerpropic;



}
var notificationSetArray2 = [];
var name;

router.post('/getnotification', function (req, res) {

    function  getAddedOrganizerProfilePic(addedevent,notification,org){
        User.findById({ _id: org }, function (err, addedorganizer) {
            if (err) {

                console.log('error get added user pofile pic');

            } else {
                console.log('base64');
                var base64str = base64_encode(addedorganizer.profileData.profileurl);
               


                var newsentNotificationObj = new sentNotificationObj(notification, addedevent,base64str);

                notificationSetArray2.push(newsentNotificationObj);


                console.log('succe get added user profile pic');
                
            }


        });
    }
 
    var id = req.body.userid;
    async.series([
        function(callback){
            console.log('in asy 111')

            
    User.findById({ _id: id }, function (err, result) {
        
                if (err) {
        
                    console.log('err get notification');
                    res.statusCode = 500;
                    res.json({
        
                        success: false,
                        message: "severe error"
        
        
        
                    });
        
        
                } else {
                    console.log('in noti arry');
                    if( result.notification.length !=0){
        
                    for (var i = 0; i < result.notification.length; i++) {
                        var addedevent = result.notification[i].addedevent;
                        var notification = result.notification[i].notification;
                        console.log(notification);
                              getAddedOrganizerProfilePic(addedevent,notification,result.notification[i].addedorganizer);
                       
        
                    }
                }
                    console.log('succes get notification');
                   
                        
                        
                    
        
                }
                
        
            });
           
            callback(null,'one');
        },function(arg1,callback){
            res.statusCode = 200;
            
                res.json({
    
                    success: true,
                    notificationMyArray: notificationSetArray2
    
    
                })
                // console.log(notificationSetArray2);
                console.log('asy 2')
    
                notificationSetArray2.length = 0;
            console.log('asy 2')
            //callback(null,'hello');
        }


    ],function(err,resulte){});

  

  
   


});



router.post('/registerEvent', function (req, res) {

    var eventname = req.body.eventname;
    var password = req.body.password;
    var eventtype = req.body.eventtype.eventType;
    var password_2;
    console.log('in register event');
    console.log(password);
    console.log(eventname);
    console.log(eventtype);
    var newEvent = new Event();


    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) { console.log('err') } else {
                newEvent.password = hash;
                newEvent.pass =password;
                newEvent.eventname = eventname;
                newEvent.eventtype = eventtype;
                newEvent.adminorganizer = userDetail.userdetail.id;
                console.log(password_2);

            }
            password_2 = hash;
            newEvent.save(function (err, resule) {

                if (err) {
                    res.statusCode = 500;
                    res.json({
                        success: false,
                        message: 'err register event'


                    });

                } else {
                    res.statusCode = 200;
                    res.json({

                        success: true,
                        message: 'successfully register'

                    });
                    console.log('success register');

                }


            });



        });
    })








});
////////////////////////////////////////////////
router.post('/login', function (req, res) {

    var eventname = req.body.eventname;
    var password = req.body.password;
    var userId = req.body.userId;
    console.log('log event id '+userId);
  

    if (!password || !eventname) {

        res.statusCode = 404;
        res.json({
            "status": "not found event",
            "message": "some feeld are not filled"
        });

    } else {

        Event.findOne({ eventname: eventname }, function (err, event) {

            if (err) {

                statusCode = 500;
                res.json({

                    success: false,
                    message: "internal server err"

                });
            }
            if (!event) {

                res.statusCode = 404;
                res.json({
                    success: false,
                    message: "not found event"

                });

            } else {





                bcrypt.compare(password, event.password, function (err, isMatch) {
                    console.log(isMatch);
                    if (err) {
                        throw err

                    }
                    if (isMatch) {

                        var isMember =false;

                         event.organizer.forEach(function(organizer){

                                if(organizer == userId){
                                        console.log('as a member');
                                        isMember =true;
                              


                                } 



                            });

                        if(event.adminorganizer == userId){
                            res.statusCode = 200;
                            console.log('as a admin');
                            res.json({
                               
                                success: true,
                                message: "successfully loging",
                                eventname: event.eventname,
                                eventid: event._id
                            });


                        } else  if(isMember ==true) {


                                     res.statusCode = 200;
                                      res.json({
    
                                success: true,
                                message: "successfully loging",
                                eventname: event.eventname,
                                eventid: event._id
                            });





                        }else {
                            res.statusCode = 200;
                            res.json({
                                success:400,
                                message:'you are not a member'

                            });


                        }

                    

                        this.currentevent.currenteventid = event._id;
                        // console.log('lo'+ this.currentevent.currenteventid);

                    } else {

                        res.statusCode = 500;
                        res.json({
                            success: false,
                            message: "password are wrong"


                        });

                    }


                });

            }


        });
    }
});



//////////////////////////////////

router.post('/loginchat', function (req, res) {
    
        var eventname = req.body.eventname;
        var password = req.body.password;
        var userId = req.body.userId;
        console.log('log event id '+userId);
      
    
        if (!password || !eventname) {
    
            res.statusCode = 404;
            res.json({
                succes:404,
                "status": "not found event",
                "message": "some feeld are not filled"
            });
    
        } else {
    
            Event.findOne({ eventname: eventname }, function (err, event) {
    
                if (err) {
    
                    statusCode = 500;
                    res.json({
    
                        success: false,
                        message: "internal server err"
    
                    });
                }
                if (!event) {
    
                    res.statusCode = 404;
                    res.json({
                        success: false,
                        message: "not found event"
    
                    });
    
                } else {
    
    
    
    
    
                    bcrypt.compare(password, event.password, function (err, isMatch) {
                        console.log(isMatch);
                        if (err) {
                            
                            res.statusCode =500;

                            res.json({
                                succes:false
                            });
                            throw err
    
                        }
                      
                        if (isMatch) {
    
                            var isMember =false;
                              event.servieceProvider.forEach(function(servieceProvider){
                                if( servieceProvider !=null){
                                if(servieceProvider == userId){
                                        console.log('as a member');
                                        isMember =true;
                              


                                } 
                            }



                            });
                             
    
                              if(isMember ==true) {
    
    
                                         res.statusCode = 200;
                                          res.json({
        
                                    success: true,
                                    message: "successfully loging",
                                    eventname: event.eventname,
                                    eventid: event._id
                                });
    
    
    
    
    
                            }else {
                                res.statusCode = 200;
                                res.json({
                                    success:400,
                                    message:'you cannot go this chat'
    
                                });
    
    
                            }
    
                        
    
                            this.currentevent.currenteventid = event._id;
                            // console.log('lo'+ this.currentevent.currenteventid);
    
                        } else {
    
                            res.statusCode = 200;
                            res.json({
                                success: false,
                                message: "password are wrong"
    
    
                            });
    
                        }
    
    
                    });
    
                }
    
    
            });
        }
    });
    
////////////////////////////////////////
    var organizerObj = function (name, id, pic,sptype) {
        this.name = name;
        this.id = id;
        this.profilepic = pic;
        this. sptype  = sptype ;
    }
    var organizerArray = [];

    router.get('/getorganizers', function (req, res) {
        console.log(' in getorganizers ');

        User.find({ usertype: 'organizer' }, function (err, organizers) {


            if (err) {
                res.statusCode = 500;
                res.json({

                    success: false,
                    message: 'error get all user'

                });
                console.log('error get all organizer');
            } else {
                organizers.forEach(function (organizer) {
                    // var neworganizerObject = new organizerObject();
                    if(organizer.profileData.profileurl!=undefined){
                    var base64str = base64_encode(organizer.profileData.profileurl);
                    var name = organizer.firstname + ' ' + organizer.lastname;
                    var id = organizer.id;
                    var pic = base64str;
                    var organizer = new organizerObj(name, id, pic);
                    organizerArray.push(organizer);
                    }
                    //console.log(organizer);

                });
                res.statusCode = 200;
                res.json({

                    success: true,
                    allOrganizerArray: organizerArray

                });
                organizerArray.length = 0;
                console.log(organizerArray);

            }



        });


    });



    router.get('/getserviceprovider', function (req, res) {
        console.log(' in get service provider ');

        User.find({ usertype:'service_provider' }, function (err, serviceprovider) {


            if (err) {
                console.log('error get service provider');
                res.statusCode = 500;
                res.json({

                    success: false,
                    message: 'error get all user'

                });
                console.log('error get all organizer');
            } else {
                console.log('fetching service provider');
                serviceprovider.forEach(function ( serviceprovider) {
                    // var neworganizerObject = new organizerObject();
                    if( serviceprovider.profileData.profileurl!=undefined){
                    var base64str = base64_encode( serviceprovider.profileData.profileurl);
                //    console.log(base64str);
                    var name =  serviceprovider.firstname + ' ' +  serviceprovider.lastname;
                    var id = serviceprovider.id;
                    var pic = base64str;
                    var sptype =serviceprovider.spCatagory;
                    var  serviceprovider = new organizerObj(name, id, pic,sptype);
                    organizerArray.push( serviceprovider);
                    }
                    //console.log(organizer);

                });
                res.statusCode = 200;
                res.json({

                    success: true,
                    allOrganizerArray: organizerArray

                });
                organizerArray.length = 0;
               //  console.log(organizerArray);

            }



        });


    });


module.exports.router = router;