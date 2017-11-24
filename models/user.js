const mongoose = require('mongoose');
const bcrypt =require('bcryptjs');
const config =require('../config/user');

var userSchema = mongoose.Schema(
    {  

        firstname:{type: String},
        lastname:{type: String},
        username:{type: String},
        email:{type: String ,required:true},
        password:{type: String ,required:true},
        usertype:{type: String },
        spCatagory:{type: String},


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