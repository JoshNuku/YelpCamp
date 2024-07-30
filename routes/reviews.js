const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/review");
const campGround = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isReviewAuthor } = require("../middleware");

// create reviews
router.post("/", isLoggedIn, catchAsync(reviews.createReview));

//delete reviews
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviews.deleteReview);

module.exports = router;
