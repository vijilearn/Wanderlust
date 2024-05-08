
const User = require("../models/user");

module.exports.renderSignupForm = (req,res) =>{
    res.render("../views/users/signup.ejs");
 };

 module.exports.registerNewUser = async(req,res) =>{
    try {
     let {username,email,password} = req.body;
     const newUser = new User({username,email});
     let registeredUser = await User.register(newUser,password);
     req.flash("success",`Hi ${username},Welcome to WanderLust`);
     res.redirect("/listings");
    } catch(e) {
       req.flash("error",e.message);
       res.redirect("/signup");
    }
  };

  module.exports.renderLoginForm = (req,res) =>{
    res.render("../views/users/login.ejs");
 };

 module.exports.loginUser = async(req,res)=>{
    let {username,password} = req.body;
    req.flash("success",`Hi ${username},You logged in,Welcome to WanderLust`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
 };

module.exports.logout = (req,res,next) =>{
    req.logout((err) =>{
       if(err) {
          return next(err);
       }
       req.flash("success","Logged out successsfully");
       res.redirect("/listings");
    });
 } 
