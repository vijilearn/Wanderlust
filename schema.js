
const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object(
      { title: Joi.string().required(), // 'title' must be a string and is required
        description: Joi.string(), // 'description' is optional
        image: Joi.object({ // 'image' is an object with 'filename' and 'url'
            filename: Joi.string(),
            url: Joi.string() }),
        price: Joi.number().min(1), // 'price' is a number
        location: Joi.string(), // 'location' is a string
        country: Joi.string(), // 'country' is a string
        category: Joi.string(),
      }
    ).required(),
    });

module.exports.reviewSchema = Joi.object({
   review:Joi.object({
    comment:Joi.string(),
    rating:Joi.number().min(1).max(5),
   }).required(),
});
