var mongoose = require('mongoose');

var ItemSchema = mongoose.Schema(
    {  

userid:String,
url:String


    }
  );
  var  Photo = mongoose.model('picture',ItemSchema);

  module.exports =Photo;
 
 
 
