//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const bcrypt= require("bcrypt");
const saltRounds=10;

mongoose.connect("mongodb://localhost:27017/userDB");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const userSchema= mongoose.Schema({
    email:String,
    password:String
});



const User= mongoose.model("User",userSchema);

app.post("/register",function(req,res){
    

    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
        const newUser= new User({
            email:req.body.username,
            password: hash
        });
        newUser.save(function(err){
            if(err)
            console.log(err);
            else
            res.render("secrets");
        });
    });

    //console.log(newUser);
    
});

app.post("/login",function(req,res){
    User.findOne(
        {email:req.body.username},
        function(err,result)
        {
        if(err)
        console.log(err);
        else
        {
            bcrypt.compare(req.body.password, result.password,function(err,resultbcrypt){
                if(resultbcrypt===true)
                res.render("secrets");
                else
                res.send("INVALID LOGIN");
            });
        }
        
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
