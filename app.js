
var express =require('express');
var path =require('path');
var bodyparser =require('body-parser');
var cors =require('cors');
var passport =require('passport');
var mongoose = require('mongoose');
var organizer =require('./routes/organizer');
var users = require('./routes/users');
var app = express();
var config =require('./config/user');
var userProfile =require('./routes/userProfile');
var serviceProviderPage_1=require('./routes/serviceProvider');
var serviceProviderPage_2 =require('./routes/serviceProvider2');
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
app.use('/api',users.router);
app.use('/api/profile',userProfile);
app.use('/api/add/',serviceProviderPage_1.router);
app.use('/api/add_2/',serviceProviderPage_2.router2);
app.use('/api/event/',organizer.router);


app.listen(port,function(){
console.log('server starting port'+port);

});
