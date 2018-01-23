var mongoose = require('mongoose');

var db_schema = mongoose.Schema({
    fname:{type:String},
    lname:{type: String},
    username:{type: String},
    email: {type: String },
    password: {type: String},
    usertype:{type:String},
    imgurl:{type:String},
    adz:[{adzname:{type:String},
          priceforservice:{type:String},
          adzdescription:{type:String},
          contactnumbers:{type:String},
          adzpicurl:{type:String}
    }],
    events:[{
        ename :{type:String},
        edate : {type:String},
        etime:{type:String},
        evanue : {type:String},
        location:{type:String},
        eimgurl:{type:String},
        edescription: {type:String},
        eorganizers:[{
            organizerid:{type:String},
            organizername:{type:String}
        }],
        esuppliers:[{
            supplierid:{type:String},
            suppliername:{type:String}
        }]

     } ]
});


var User = module.exports = mongoose.model('user2', db_schema);