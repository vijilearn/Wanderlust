
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require('../utils/wrapasync.js');
const multer = require('multer');
const {storage} = require("../cloudConfig");
const upload = multer({ storage });
const {isLoggedIn,isOwner,validatingListing} = require("../middleware.js");
const listingController=require("../controllers/listing.js");


//Index Route && Create Route
router.route("/")
   .get( wrapAsync(listingController.index))
   .post(isLoggedIn,upload.single('listing[image]'),validatingListing, 
   wrapAsync(listingController.create));

  //New Route
  router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));

  //Edit Route
  router.route("/:id/edit")
  .get(isLoggedIn,isOwner,upload.single('listing[image]'),wrapAsync(listingController.edit))
  
  //update Route && Delete Route && Show Route
  router.route("/:id")
    .get( wrapAsync(listingController.show))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),
         validatingListing,wrapAsync(listingController.update))  
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroy));
    
  module.exports = router;