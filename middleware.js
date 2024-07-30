const campground = require("./models/campground");
const Review = require("./models/review");
const AppError = require("./utils/appError");
const Joi = require("joi");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must sign in first");
    return res.redirect("/user/login");
  }
  next();
};

module.exports.validateCampGround = (req, res, next) => {
  const campGroundSchema = Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      //image: Joi.string().required(),
      price: Joi.number().required().min(0),
      description: Joi.string().required(),
      location: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array(),
  });
  const { error } = campGroundSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((cur) => cur.message).join(",");
    throw new AppError(errMsg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const camp = await campground.findById(id);

  if (!camp.author.equals(req.user.id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${camp._id}`);
  }
  next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review.author.equals(req.user.id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
