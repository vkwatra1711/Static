const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const base = `${__dirname}/public`;
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const cookie = require('cookie-session');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
mongoose.connect('mongodb+srv://Vansh:Naman1703@cluster0.zdswl.mongodb.net', {useNewUrlParser:true, useUnifiedTopology:true})
const User = mongoose.model('User', new mongoose.Schema({
    googleID: String,
    name: String,
    isAdmin: Boolean
}));
//app.use(express.static('public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
dotenv.config();

//app.use('/api/v1/stores', require('../api/routes/stores'));

passport.use(new GoogleStrategy(
    {
        clientID: "1067748629868-d6n3l0vva0v3ilqahh5uvdgkmv479po3.apps.googleusercontent.com",
        clientSecret: "TaNejxrXTpvRwDBhmkrVVFSv",
        callbackURL: "http://localhost:3000/send-command"
    }, (accessToken, refreshToken, profile, done) => {
        
        User.findOne({googleID: profile.id}).then((currentUser)=> {
            if(currentUser){
                done(null,currentUser);
            }else{
                new User({
                    googleID: profile.id,
                    name: profile.name.givenName,
                    isAdmin: false
                }).save().then((newUser)=>{
                    done(null,newUser);
                });
            }
        })
    }
));
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());


app.use(cookie({
    maxAge: 24*60*60*1000,
    keys:[process.env.COOKIE_KEY]
}));

app.use(cors());
app.get('/', function (req, res) {
    res.sendFile(`${base}/device-list.html`);
});
app.get('/register-device', (req, res) => {
    res.sendFile(`${base}/register-device.html`);
});
app.get('/add', (req, res) => {
    res.sendFile(`${base}/add.html`);
});
app.get('/index', (req, res) => {
    res.sendFile(`${base}/index.html`);
});
app.get('/send-command', (req, res) => {
    res.sendFile(`${base}/send-command.html`);
});
app.get('/store-list', (req, res) => {
    res.sendFile(`${base}/store-list.html`);
});
app.get('/registration', (req, res) => {
    res.sendFile(`${base}/registration.html`);
});
app.get('/fridge-list', (req, res) => {
    res.sendFile(`${base}/fridge-list.html`);
});
app.get('/login', (req, res) => {
    res.sendFile(`${base}/login.html`);
});
app.get('/about', (req, res) => {
    res.sendFile(`${base}/about-me.html`);
});
app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));
app.get('/auth/google/redirect', passport.authenticate('google'),(req,res)=>{
    const user = req.user;
    app.locals.user = user;
    res.redirect('/send-commands');
});

app.get('/auth/google/user', (req,res)=>{
    res.send(app.locals.user)
});
app.get('*', (req, res) => {
    res.sendFile(`${base}/404.html`);
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
