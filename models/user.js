const mongoose = require('mongoose');
const bcrypt =require('bcryptjs');
const config =require('../config/user');

var userSchema = mongoose.Schema(
    {  

        firstname:{type: String},
        lastname:{type: String},
        username:{type: String},
        email:{type: String },
        password:{type: String },
        usertype:{type: String },
        spCatagory:{type: String},
        notification:[{
            notification:String,
            addedevent:String,
            addedorganizer:String,
            date:Date,


        }],
        profileData:{
            profileurl:{type: String},
            coverurl:{type:String},
            advertiesment:[],
            myevent:{
                eventname:[],
                eventdiscription:[],
                eventtheamurl:[],
            
            }
        },
        aboutDetail:{
                    name:{type:String},
                    email:{type:String},
                    phoneNumber:{type:String},
                    address:{type:String},
                    qualification:{type:String},
                    experience:{type:String},
        },

    }
  );


 const User = module.exports =mongoose.model('User',userSchema);

 module.exports.getUserById =function(id,callback){

    User.findById(id,callback);


 };
 

 module.exports.getUserByUsername = function(username,callback){
    const query = {username:username};   
    User.findOne(query,callback);

 };

 module.exports.addUser =function(newUser,callback){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newUser.password,salt,function(err,hash){
                if(err){console.log('err')}
                newUser.password =hash;
                newUser.save(callback);


        });

    })

 }
 

 module.exports.comparePassword =function(candidatePassword,actualPassword,callback){
console.log(candidatePassword);
bcrypt.compare(candidatePassword,actualPassword,function(err,isMatch){
console.log(isMatch);
    if(err){
throw err

    }
    callback(null,isMatch);

});
    
 }
 
