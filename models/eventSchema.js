const mongoose = require('mongoose');

const config =require('../config/user');

var userSchema = mongoose.Schema(
    {  
        eventname:{type:String},
        Date:{type:Date},
        location:{type:String},
        organizer:[],
        eventtype:String
        
        

    }
  );


 const Event = module.exports =mongoose.model('event',userSchema);