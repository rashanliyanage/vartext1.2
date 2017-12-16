var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var Event = require('../models/eventSchema');
var userDetail =require('./users');


router.post('/registerEvent',function(req,res){

        var eventname =req.body.eventname;
        var password =req.body.password;
        var eventtype =req.body.eventtype.eventType;
        console.log('in register event');
        console.log(password);
        console.log(eventname);
        console.log(eventtype);

     var   newEvent = new Event();
     newEvent.eventname =eventname;
     newEvent.password = password;
     newEvent. eventtype = eventtype;
     newEvent.organizer = userDetail.userdetail.id;

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

module.exports.router =router;