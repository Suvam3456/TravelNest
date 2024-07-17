const Joi = require('joi');
// To do Schema Validation we are using joi tool which is an npm package and sends error
// Individual feilds pe validation ko apply krta
// Ye jab hoppscotch se request aayegi tab jo request ki body me aara usko validate krne ke liye

module.exports.listingSchema = Joi.object({
    // It means 'joi' ke andar listing naam ki object aani chaiye
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        // .min(0) means negative me na ho price so we set its min value
        image : Joi.string().allow("", null)
        // image Jaruri nhi required ho but honi chaiye string type ki. We allow empty string or null value as default mil jayega usko mongoose se agar null bhi hua tho.
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({ // review naam ki object aani chaiye
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
})