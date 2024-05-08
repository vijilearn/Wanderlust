const Listing = require("../models/listing");
const Review = require("../models/review.js");

module.exports.createReview = async(req,res,next) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author= req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Your Review added successfully");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req,res,next) =>{
    let {reviewId,id} = req.params;
     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     await Review.findByIdAndDelete(reviewId);
     req.flash("success","Your Review removed successfully");
     res.redirect(`/listings/${id}`);
};