var mongoose = require('mongoose');

var userSchema = mongoose.Schema(
    {  

        firstname: String,
        lastname:String,
        username:String,
        email:String,
        password:String,
        usertype:String,
        spCatagory:String,


    }
  );
  var  user = mongoose.model('user',userSchema);

  module.exports =user;
 