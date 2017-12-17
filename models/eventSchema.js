const mongoose = require('mongoose');

const config =require('../config/user');

var userSchema = mongoose.Schema(
    {  
        password:{type:String},
        eventname:{type:String},
        Date:{type:Date},
        location:{type:String},
        organizer:[],
        adminorganizer:{type:String},
        eventtype:String
        
        

    }
  );


 const Event = module.exports =mongoose.model('event',userSchema);