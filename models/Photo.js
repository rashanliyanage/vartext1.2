const mongoose = require('mongoose');

const config =require('../config/user');

var userSchema = mongoose.Schema(
    {  

        url:{type: String},
        id:{type: String},
        

    }
  );


 const Photo = module.exports =mongoose.model('Photo',userSchema);