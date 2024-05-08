
const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapasync.js');
const {validatingReview,isLoggedIn,isReviewAuthor}= require("../middleware.js");
const reviewController = require("../controllers/review.js");


//Reviews 
//create reviews route
router.post("/",isLoggedIn,validatingReview,
wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
  wrapAsync(reviewController.destroyReview));
   
module.exports = router;