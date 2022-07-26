//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
// add this
const session= require("express-session");
const passport= require("passport");
const passportLocalMongoose= require("passport-local-mongoose");


const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// ****************add these**************

app.use(session({
  secret: 'Our little secret.',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
//*********************till here*********************** 

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema= mongoose.Schema({
    email:String,
    password:String
});

//******************start here**************** */

userSchema.plugin(passportLocalMongoose);

const User= mongoose.model("User",userSchema); // already added

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/secrets", function(req,res){
    if(req.isAuthenticated())
    res.render("secrets");
    else
    res.redirect("/login");
});
//*********************till here**************** */


app.post("/register",function(req,res){
   //************************add this************** */
   User.register({username:req.body.username},req.body.password,function(err,user){
    if(err)
    {
        console.log(err);
        req.redirect("/register");
    }
    else{
            passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
        });
    }
   });
   //***************till here********************** */
});

app.post("/login",function(req,res){
    const user= new User({
        username:req.body.username,
        password:req.body.password
    });

    req.login(user, function(err){
        if(err)
        console.log(err);
        else
        {
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            });
        }
        
    })
});

app.get("/logout",function(req,res){
    req.logOut(function(err){
        if(err)
        console.log(err);
        else
        res.redirect("/");
    });
    
});

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});






app.listen(3000,function(){
    console.log("Connected");
});
