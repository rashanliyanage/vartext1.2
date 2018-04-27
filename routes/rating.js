var express = require('express');
var router = express.Router();
var Rate = require('../models/rating');

var config =require('../config/user');




router.get('', (req, res) => {
    var overallRating=0;
    var avgRating=0;
    var ratings =null;
    Rate.find({}, function(err, rates) {
        if (err) throw err;
        ratings=rates;
        // object of all the users
        ratings.forEach(function(value){
            overallRating=overallRating+value.rating;
         
       });
        console.log(ratings);
        console.log('total Ratings: ',overallRating);
        avgRating=overallRating/ratings.length;
        console.log('AVG total Ratings: ',avgRating);
        res.json(avgRating);
      });
    
    
    
  
});



router.post('/rate',function(req,res,next){
    console.log('Rating....',req.body);
    var rate =req.body.rating;
    var userId =req.body.UserId;
    console.log('Rating....',rate);

    var newRate = Rate({
         rating:req.body.rating,
         UserId:req.body,userId,
      });

      newRate.save(function(err) {
        if (err) throw err;
        res.json("Rated")
        console.log('New Rate Added!');
      })

});

module.exports.router =router;
