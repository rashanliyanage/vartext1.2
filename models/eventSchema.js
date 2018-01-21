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
        eventtype:String,
        eventlocation:{
            lat:{type :Number},
            lng:{type:Number}
        },
        BroadcastEvent:{
                eventType:{type:String},
                eventname:{type:String},
                eventDiscription:{type:String},
                eventPictureUrl:{type:String},
                date:{type:String},
                time:{type:String}



        }
        
        

    }
  );


 const Event = module.exports =mongoose.model('event',userSchema);