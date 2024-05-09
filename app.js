
if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

const {selectCategory,selectCountry}= require("./controllers/listing.js")
const express = require("express");
const app = express();
const expressError = require("./utils/expressError.js");
const mongoose = require("mongoose");
const ejsMate =require("ejs-mate");
const Path = require("path");
const methoOverride = require("method-override")
const fs = require('fs');
const Joi = require('joi');
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter=require("./routes/user.js");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash= require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const dbUrl = process.env.Mongo_URL;
const port = 8080;

main()
.then(() =>{
    console.log("conected to DB");
})
.catch((err) =>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

app.engine('ejs', ejsMate);
app.set("view engine",'ejs');
app.set("views",Path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methoOverride("_method"));
app.use(express.static(Path.join(__dirname ,'/public')));
app.use(cookieParser());
const apiRouter = express.Router();
app.use('/listings', apiRouter);

require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL; // 'https://your-service.onrender.com/api'

const store =  MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
       secret:process.env.SECERET,
  },
  touchAfter:24*3600,
});

store.on("error",() =>{
    console.log("something went wrong",err);
})

const sessionOptions={
    store:store,
    secret:process.env.SECERET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 1000 * 60 * 60 * 24 * 1,
        maxAge:1000 * 60 * 60 * 24 * 1,
        httpOnly:true,
    },
 };

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.get("/wanderlust-a7b2.onrender.com",async(req,res)=>{
    try {
        const response = await axios.get(`${API_BASE_URL}/listings`);
        return res.redirect("/listings");
      } catch (error) {
        req.flash("error","Listing not Exists!");
        return res.render("error.ejs");
      }
    
})

app.get("/privacy",(req,res)=>{
    res.render("../views/policies/privacy.ejs");
})

app.get("/country",selectCountry);

app.get("/Terms",(req,res)=>{
    res.render("../views/policies/term.ejs");
})

app.get("/category",selectCategory);


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get("*",(req,res,next) =>{
    next(new expressError(404,"page not found"));
})

app.use((err, req, res, next) => {
    let {statusCode=500,message="something went wrong"}=err;

    res.render("./error.ejs",{err});
});


app.listen(port,() =>{
    console.log(`Server is listening to port ${port}`);
})