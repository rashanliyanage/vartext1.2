var mongoose = require('mongoose');

var userSchema = mongoose.Schema(
    {  

        firstname: String,
        lastname:String,
        usernaem:String,
        email:String,
        password:String,
        confirmpassword:String,
        usertype:String,
        spcatagory:String,


    }
  );
  var  user = mongoose.model('user',userSchema);

  module.exports =user;
 