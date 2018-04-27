const mongoose = require('mongoose');

const config =require('../config/user');

var userSchema = mongoose.Schema(
    {  

        rating:{type:Number},
        Userid:{type: String},
        

    }
  );


 const Rating = module.exports =mongoose.model('Rating',userSchema);

 module.exports.getUserById =function(id,callback){
    
    // Rating.find({},)
    
    
     };