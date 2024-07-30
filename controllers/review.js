const Review = require("../models/review");
const campGround = require("../models/campground");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  console.log(req.body, id);
  const campground = await campGround.findById(id);
  const review = new Review(req.body);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save().then((res) => console.log(res));
  await campground.save();
  req.flash("success", "Sucessfully created review");

  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { reviewId, id } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await campGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("success", "Sucessfully deleted review");
  res.redirect(`/campgrounds/${id}`);
};
