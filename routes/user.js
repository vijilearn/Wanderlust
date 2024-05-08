
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync");
const passport = require("passport");
const {saveRedirectUrl}= require("../middleware");
const userController = require("../controllers/user");

router.route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.registerNewUser));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
passport.authenticate('local', 
{ failureRedirect: '/login',
failureFlash:true }), wrapAsync(userController.loginUser))

router.get("/logout",userController.logout);

module.exports = router;