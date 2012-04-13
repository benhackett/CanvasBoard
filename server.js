var express = require('express');

var serve = express.createServer();
var io = require('socket.io').listen(5000);
var _ = require('underscore')._;

serve.configure(function() {
	serve.use(express.static(__dirname + '/static'));
});

serve.get('/',function(req,res) {
	res.send("howdy draw");
	console.log('howdy server');
});







//Login Stuff

require('mongoose');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/4000');


//Users
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Validations = require('./validations.js');
var salt = 'mySaltString';
var SHA2 = new(require('jshashes').SHA512)();

//Password Encryption Function
//1. Why not an typical if else formatting with a {if(){} else(){}}?
function encodePassword(pass){
  if(typeof pass === 'string'  && pass.length < 6) return ''

    return SHA2.b64_hmac(pass,salt)
}


//Create User Schema
//1. What is trim?
var UserSchema = new Schema({
  nick : {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  email : {
    type: String,
    required: true,
    unique:true,
    trim: true,
    lowercase: true
  },

  password : {
    type: String,
    set: encodePassword,
    required: true
  }
});

//Logging In
//1. Where are we getting the confirmed login being passed here?
//2. Also, what type is statics and classicLogin, objects? Are they part of all the Schema objects?
//3. What is where?
//4. What is cb?
//5. var o makes a new userSchema?
UserSchema.statics.classicLogin = function(login, pass, cb) {
  if(login && pass) {
      mongoose.models.User
        .where('email', login)
        .where('password', encodePassword(pass))
        .findOne(cb)
  }else{
    //error message
    var o = new this({
      nick: 'veryUniquejerewelA',
      password: '',
      email: login +'aaa'
    })
    o.save(cb)
  }
}


//Validating
//1. Don't understand whats going on here
//2. What is validations?
//3. Wht is the mongoose plugin
//4. In mongoose.model, what is being passed?
UserSchema.path('nick').validate(
  Validations.uniqueFieldInsensitive('User', 'nick'), 'unique')
  
UserSchema.path('email').validate(
  Validations.uniqueFieldinsensitive('User', 'email'), 'unique')

UserSchema.path('email').validate(
  Validations.emailFormat, 'format')
  
UserSchema.path('password').validate(
  Validations.cannotBeEmpty, 'password')

UserSchema.plugin(mongoose.availablePlugins.timestamper)

mongoose.model('User', UserSchema)






//auth.js
//app.get('/auth/popover', auth.popover);
exports.popover = function(req, res){
  //req.session.popover = new Date();
  console.log('My Session:', req.session)
  res.render('auth/index_pop', req.viewVars);
};

// CLASSIC LOGIN / SIGNUP because every auth seems too messy for login+pass
// app.post('/auth/classic-signup', auth.classicSignup)
//1. if no request to body?
//2. what is app.models.user(), is that mongoose?
//3. how is err getting passed to function?
//4. what is an _do?
//5. why no colons, esp after user.set?
//6. These are calling objects, but are they getting printed?
exports.classicSignUp = function(req,res,next){
  if(!req.body){
    console.log("Why aren't you signing anyone up")
    return res.redirect('/?nobodySignup')
  }

  var user = new app.models.user();

  user.set('nick', req.body.nick)
  user.set('email', req.body.email)
  user.set('password', req.body.pass)
  user.set('providers', ['signup:' +user.get('email')])
  user.set('profiles', [{_name: 'signup'}])

  user.save(function(err)){
    if(err){ //validation failed
      req.viewVars.u = user
      return classicYieldErr(req,res 'signup',err)

    }else{
      req.session.user = {
        provider:'signup',
        id: user.get('id')
        nick: user.get('nick')

      }
      req.flash('notice', 'Welcome!')
      req.viewVars.welcome_login = 'Welcome, ' + user.nick

    res.render('auth/win_pop', req.viewVars)
    }
  })
};

// app.post('/auth/classic-login',  auth.classicLogin)
exports.classicLogin = function(req.res,next){
  if(!req.body){
    console.log("Why didnt you log anyone in?")
    return res.redirect('/?nobodyLogin')
  }
  app.models.User.classicLogin(req.body.email, req.body.pass, function(err,user){
    if(err){//validation failed
        return classicYieldErr(req,res,'signIn',err)
    }else{
      if(user){ //login

        req.session.user = {
          provider:'signup',
          id:user.get('id'),
          nick:user.get('nick'),
        }
        req.flash('notice', 'welcome'))
        req.viewVars.welcome_login = "Welcome " + user.nick
      res.rener ('auth/win_pop', req.viewVars)

      }else{ //not found
        return classicYieldErr(req, res, 'signIn', 
          {errors:{
            'loginpass':{
              name: 'V',
              path: 'login+password',
              type: 'loginpass'

            }
          }})
    }
  }
  })
};


//display form error
function classicYieldErr(req,res,mode,err){
  req.viewVars.erroredForm = mode
  if(mode === 'signin'){
    req.viewVars.signin_errors = app.helpers.displayErrors(err)
  }else{
    req.viewVars.signup_errors = app.helpers.displayErrors(err)
  }
    req.viewVars.email = req.body.email

    res.render('auth/index_pop' req.viewVars);
}






app.set('views',__dirname + '/views');
app.set('view engine', 'jade');

app.get('/login', function(req, res) {
  res.render('login.jade', {
    title: 'Login user'
  });
});

app.get('/logout', isUser, function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

app.post('/login', function(req, res) {
  var select = {
      user: req.body.username
    , pass: crypto.createHash('sha256').update(req.body.password + conf.salt).digest('hex')
  };

  db.user.findOne(select, function(err, user) {
    if (!err && user) {
      // Found user register session
      req.session.user = user;
      res.redirect('/');
    } else {
      // User not found lets go through login again
      res.redirect('/login');
    }

  });
});









//The buffer will be the last n user paths. 
//New users will be sent the buffer so they see the previous n paths immedietly.
var buffer = []; 

io.sockets.on('connection', function(socket) {
	
	socket.json.send({ buffer: buffer });
    socket.json.broadcast.emit('UserConnected', "User " + socket.id + " connected.");

    socket.on('drawPath', function(message){
        var msg = { message: [socket.id, message] };
        buffer.push(msg);
        if (buffer.length > 300){
	        buffer.shift();	
        } 
        socket.json.broadcast.emit(msg);
    });

    socket.on('clientPath', function(data){
    	socket.json.broadcast.emit('serverPath', data);
    });

    socket.on('disconnect', function(){
        socket.json.broadcast.emit("UserDisconnected", "User " + socket.id + ' disconnected.');
    });
});

serve.listen(4000);