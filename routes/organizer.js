var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var Event = require('../models/eventSchema');
var userDetail =require('./users');
const bcrypt =require('bcryptjs');


router.post('/registerEvent',function(req,res){

        var eventname =req.body.eventname;
        var password =req.body.password;
        var eventtype =req.body.eventtype.eventType;
        var password_2;
        console.log('in register event');
        console.log(password);
        console.log(eventname);
        console.log(eventtype);
        var   newEvent = new Event();
       
    
     bcrypt.genSalt(10,function(err,salt){
     bcrypt.hash(password,salt,function(err,hash){
        if(err){console.log('err')}else{
            newEvent.password =hash;
            newEvent.eventname =eventname;
            newEvent. eventtype = eventtype;
            newEvent.adminorganizer = userDetail.userdetail.id;
            console.log(password_2);

        }
        password_2 =hash;
        newEvent.save(function(err,resule){
            
                    if(err){
                        res.statusCode = 500;
                        res.json({
                            success:false,
                            message:'err register event'
            
            
                        });
            
                    }else{
                            res.statusCode =200;
                            res.json({
            
                                success:true,
                                message:'successfully register'
            
                            });
                        console.log('success register');
            
                    }
            
            
                 });
      


});
})
           
     






});

router.post('/login',function(req,res){

var eventname = req.body.eventname;
var password = req.body.password;

if(!password || !eventname){

    res.statusCode =404;
    res.json({
      "status":"not found event",
      "message":"some feeld are not filled"
    });

}else{

    Event.findOne({eventname:eventname},function(err,event){

        if(err){

            statusCode =500;
            res.json({

                    success:false,
                    message:"internal server err"

            });
        }
        if(!event){

            res.statusCode =404;
            res.json({
                success:false,
                message:"not found event"

            });

        }else{


            bcrypt.compare(password,event.password,function(err,isMatch){
                console.log(isMatch);
                    if(err){
                throw err
                
                    }
                    if(isMatch){
                            
                        res.statusCode =200;
                        res.json({

                            success:true,
                            message:"successfully loging",
                            eventname:event.eventname
                        });

                    }else{

                        res.statusCode =500;
                        res.json({
                            success:false,
                            message:"password are wrong"

                        });

                    }
                    
                
                });

        }


    });
}



});
module.exports.router =router;