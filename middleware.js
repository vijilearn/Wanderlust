
const Listing = require("./models/listing");
const expressError = require("./utils/expressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next) =>{
   if(!req.isAuthenticated())
   {
      //store the url
      req.session.redirectUrl = req.originalUrl;
      req.flash("error","Access Denied,You must be logged in");
      return res.redirect("/login");
   }
   next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
   if(req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
   }
   next();
};

module.exports.isOwner = async(req,res,next) =>{
   let {id} = req.params;
   let listing = await Listing.findById(id);
   if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","User is different,So Permission Denined");
      res.redirect(`/listings/${id}`);
   }
   next();
};

module.exports. validatingListing = (req,res,next) =>{
   let {error} = listingSchema.validate(req.body);
   console.log(error);
   if(error){
       let errMsg = error.details.map((el) => el.message).join(",");
       throw new expressError(400,errMsg);
     } else {
         next();
     }
};

module.exports.validatingReview =(req,res,next) =>{
   let {error} = reviewSchema.validate(req.body);
   if(error){
       let errMsg = error.details.map((el) => el.message).join(",");
       throw new expressError(350,errMsg);
     } else {
       next();
     }
};

module.exports.isReviewAuthor = async(req,res,next) =>{
   let {id,reviewId} = req.params;
   let review = await Review.findById(reviewId);
   if(!review.author._id.equals(res.locals.currUser._id)){
      req.flash("error","Created by someone,So Permission Denined");
      res.redirect(`/listings/${id}`);
   }
   next();
};