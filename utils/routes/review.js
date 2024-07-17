const express = require("express");
const router = express.Router({ mergeParams: true });

// Express routers are a way to organise/restructure your Express Application such that our primary app.js file does not become bloated. As such functionality wise it does'nt add anything new in existing.

const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// Post Review Route

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Review Route

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));
// Here isLoggedIn middleware is used so that postman/Hoppscotch se koi request na bhejde as usme login hone ka bhi jarurat nhi padega and anyone can edit/delete any review by sending request to backend.

module.exports = router;