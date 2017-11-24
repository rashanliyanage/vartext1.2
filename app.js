
var express =require('express');
var path =require('path');
var bodyparser =require('body-parser');
var cors =require('cors');
var passport =require('passport');
var mongoose = require('mongoose');
var users = require('./routes/users');
var app = express();
var config =require('./config/user');

            mongoose.connect(config.database);
            mongoose.connection.on('connected',function(){
                console.log('connected');

            });
            mongoose.connection.on('error',function(err){
                console.log('error');

            });

const port =3000;
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyparser.json());
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
app.use('/api',users);
app.get('/',function(req,res){});

app.listen(port,function(){
console.log('server starting port'+port);

});
