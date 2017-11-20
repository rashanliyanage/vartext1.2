var express = require('express');
var router = express.Router();
var User = require('../userSchema');
var multer = require('multer');
var path = require('path');
var  fs =require('fs');
var Photo = require('../Schema');
var base64 = require('base-64');
var User = require('../userSchema');
router.post('/regsiter',function(req,res){
    var newUser = new User();

        if(req.body.usertype=='organizer'){

    console.log('in the api');
    var firstname =req.body.firstname; 
    var lastname = req.body.lastname;       
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var usertype = req.body.usertype;
    
           
             
              newUser.firstname =firstname;
              newUser.lastname = lastname;
              newUser.username = username;
              newUser.email = email;
              newUser.password =password;
              newUser.usertype = usertype;
        }else if(req.body.usertype=='service_provider'){

            var firstname =req.body.firstname; 
            var lastname = req.body.lastname;       
            var username = req.body.username;
            var email = req.body.email;
            var password = req.body.password;
            var usertype = req.body.usertype;
            var spCatagory = req.body.spCatagory;
            
            newUser.firstname =firstname;
            newUser.lastname = lastname;
            newUser.username = username;
            newUser.email = email;
            newUser.password =password;
            newUser.usertype = usertype;
            newUser.spCatagory =spCatagory;
        }      
  newUser.save(function(err,result){
            if(err){
                res.statusCode =500;
                res.json({
                    "message":"register err"
                });

            }else{
              statusCode =200;
              res.json({
  
                "message":"register success"
              });
            }
  });
  });

  router.post('/login',function(req,res){
    console.log('in the login api');
    var username =req.body.username;
    var password =req.body.password;

    if(!username|| !password){

      res.statusCode =404;
      res.json({
        "status":"not found error",
        "message":"some feeld are not filled"
      });

     

    }else {
      User.find({username:username ,password:password},function(err,result){

        console.log(result);
        if(err){

          res.statusCode =500;
          res.json({
              "status":"error",
              "message":"internal server error"
          });
        }else if(result==''){
          console.log('not user');
            res.statusCode =404;
            res.json({
              "status":"error",
              "message":"Not found user"

            });

        } else{

          res.statusCode =200;
          res.json({
            "status":"success",
            "message":"succesfully login"

          });
        }

      });

    }




  });



  
  var path2;
  var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/profile/')
        },

    filename: function (req, file, cb) {
    cb(null, file.originalname);
    console.log('origina'+file.originalname);
    var path1 =   './uploads/profile/' + file.originalname;
    path2=path1;
    console.log('path'+path2);
  }
});

var upload = multer({ storage: storage });


        function base64_encode(file) {  //read imge file
        // read binary data
        console.log(file);
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString('base64');
        }

//calling upload url

router.post("/upload", upload.array("uploads[]", 12), function (req, res) {

console.log('path'+path2);
if(path2!=null){
        var newPhoto =new Photo();
        newPhoto.url=path2;


        newPhoto.save(function(err,result){
            if(err){
            console.log('err');
            res.sendStatus=500;
            res.json(
            {
                "status": "err",
                 "message": "User not successfully created",
            }
);
}else{
  res.statusCode =200;
  console.log('saved');



        Photo.findOne({url:path2},function(err,photo){
  
        if(err){
    res.statusCode = 404;
    res.json({
      "status": "error",
      "message": "404 Not Found"
    });
    console.log('photo err');
  } else{
    console.log('photo is '+ photo);
var base64str = base64_encode(photo.url);

    res.statusCode = 200;
    res.json({
      "status": "success",
      "message": "fourd profile picture",
      
      "photodata": base64str
      
    });
  }
});
}
});
}else{
console.log('path null');

}
});

  module.exports=router;
  