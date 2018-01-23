//import { read } from 'fs';

var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config =require('../config/user');
var User2 =require('../models/user_2');

var userArray=[];
module.exports.userdetail = userdetail ={
    id:'',
    name:'rashan',
    profilepicture:'',
}
///////////////////////////////////////////////////////////////////////
router.post('/register',function(req,res){
console.log('in the register');
    var newUser = new User();
    
            if(req.body.usertype=='organizer'){
    
        console.log('in the api');
        var firstname =req.body.firstname; 
        var lastname = req.body.lastname;       
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        var usertype = req.body.usertype;
        
                 
                  newUser.firstname =firstname;
                  newUser.lastname = lastname;
                  newUser.username = username;
                  newUser.email = email;
                  newUser.password =password;
                  newUser.usertype = usertype;
            }else if(req.body.usertype=='service_provider'){
    
                var firstname =req.body.firstname; 
                var lastname = req.body.lastname;       
                var username = req.body.username;
                var email = req.body.email;
                var password = req.body.password;
                var usertype = req.body.usertype;
                var spCatagory = req.body.spCatagory;
                
                newUser.firstname =firstname;
                newUser.lastname = lastname;
                newUser.username = username;
                newUser.email = email;
                newUser.password =password;
                newUser.usertype = usertype;
                newUser.spCatagory =spCatagory;
            }
           
            
            User.addUser(newUser,function(err,user){
                var user_id =user._id;
               
                    if(err){
                        res.json({
                            success:false,
                            message:'failled to register user'

                        });

                    } else{
                        user2Register(user_id, firstname,lastname ,username, email ,password ,usertype);
                        res.json({
                            success:true,
                            message:'success  to register user'

                        });

                    }

            });

});
///////////////////////////////////////////////////////////////////////////////////////////////////////
var user2Register =function(user_id,firstname,lastname ,username, email ,password ,usertype){
    var  referanceuserid =user_id;
    var firstname =firstname;
    var lastname =lastname;
    var username =username;
    var email =email;
    var password =password;
    var dupusertype =usertype;
    var usertype;
    if(dupusertype == 'organizer'){
        usertype ='Organizer';

    }
    if(dupusertype=='service_provider'){
        usertype ='Supplier';
    }

    var newUse2 =new User2();

        newUse2.fname =firstname;
        newUse2.lname =lastname;
        newUse2.username =username;
        newUse2.email =email;
        newUse2.password =password;
        newUse2.usertype = usertype;
        newUse2.referanceuserid =referanceuserid;
        
        newUse2.save(function(err,user){

            if(err){
                throw err;

            }else{
                User.findByIdAndUpdate({_id:referanceuserid },{$set: {'referanceuserid':user._id}},function(err,user){
                        if(err){
                            throw err
                            console.log('error register ');

                        }else {


                            console.log('success register');

                        }


                });
                console.log('save success user 2');

            }



        });
        


}
////////////////////////////////////////////////////////////////////////////
router.post("/register2",function(req,res){
    
      var fname = req.body.fname;
      var lname = req.body.lname;
      var username = req.body.username;
      var email = req.body.email;
      var password = req.body.password;
      var usertype = req.body.usertype;
      
      var newuser = new User2();
        newuser.fname = fname;
        newuser.lname = lname;
        newuser.username = username;
        newuser.email = email;
        newuser.password = password;
        newuser.usertype = usertype;
        newuser.imgurl = "http://10.10.28.104:3000/profile/newUser.png"

       

    

  
       
    newuser.save(function(err,savedUser){  

        if(err){
            throw err;
        }
        else{

          var userid =savedUser._id;
            registerForUser(userid,fname,lname,username,email,password,usertype );
          res.json({ msg:"success"});
        }
    });
    
  });

  var registerForUser = function(userid,fname,lname,username,email,password,usertype){
    var newUserForUser = new User();
    newUserForUser.referanceuserid=userid;
    newUserForUser.firstname = fname;
    newUserForUser.lastname = lname;
    newUserForUser.username = username;
    newUserForUser.email = email;
    newUserForUser.password = password;

      if(usertype == 'Supplier'){
        newUserForUser.usertype  ='service_provider';
    }else{
        newUserForUser.usertype ='organizer';
    }
    User.addUser(newUserForUser,function(err,user2){  
        if(err){
            throw err;
        }
        else{
            User2.findOneAndUpdate({_id:userid},{$set: {'referanceuserid':user2._id}},function(err,user){

                    if(err){

                        throw err
                    }else {

                        console.log('successe save referance id on android');

                    }


            });
            console.log('userangular saved');
        }
    });
   


  }


/////////////////////////////////////////////////////////////////////////////////////////////////////

  router.post('/loginorganizer',function(req,res){
    var email = req.body.email;
    var password = req.body.password;
   
        User2.findOne({email: email, password: password,usertype: "Organizer"}, function(err, user) {
            if (err) {
                res.json({status: 0, msg:"fail"});
            }
            if (!user) {
                res.json({status: 3, msg:email,password});
            }else{
  
              console.log(user._id);
            res.json({
              msg:"success",  
              imgurl: user.imgurl,
              id:user._id,
              fname:user.fname,
              lname:user.lname
  
          });
  
            }
        });
                              
  });
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  router.post('/loginsupplier',function(req,res){
      var email = req.body.email;
      var password = req.body.password;
     
          User2.findOne({email: email, password: password,usertype: "Supplier"}, function(err, user) {
              if (err) {
                  res.json({status: 0, msg:"fail"});
              }
              if (!user) {
                  res.json({status: 3, msg:email,password});
              }else{
    
                console.log(user._id);
              res.json({
                msg:"success",  
                imgurl: user.imgurl,
                id:user._id,
                fname:user.fname,
                lname:user.lname
    
            });
    
              }
          });
                                
    });

///////////////////////////////////////////////////////////////////////////////////////////

router.post('/authenticate',function(req,res,next){
    console.log('in the api');
        const username =req.body.username;
        console.log(username);
        const password = req.body.password;
        console.log(password);
        if(!username|| !password){
            console.log('hii');
                  res.statusCode =404;
                  res.json({
                    "status":"not found error",
                    "message":"some feeld are not filled"
                  });
            
                 }else{ 
                    
                    User.getUserByUsername(username,function(err,user){
           console.log(user);
            if(err){
                throw err;
            }
             if(!user){
        
                res.json({
                    success:false,
                    message:'user not found'

                });
            }
           else { User.comparePassword(password,user.password,function(err,isMatch){

                if(err){throw err}
                if(isMatch){ 

                    const token =jwt.sign({data:user},config.secret,{
                        expiresIn:604800// 1 week
                    });
                    res.json({
                        success:true,
                        token:'JWT'+token,
                        user:{

                            id:user._id,
                            username:user.username,
                            email:user.email,
                            usertype:user.usertype
                        }

                    });
                    this.userdetail.id =user._id;
                }else{
                    return res.json({success:false,message:'wrong password'});

                }
            });
        }
        });
    }

});

   
module.exports.router =router;
