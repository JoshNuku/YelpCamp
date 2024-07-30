const express = require("express");
const router = express.Router();
const campGround = require("../models/campground");
const campgrounds = require("../controllers/campground");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampGround } = require("../middleware");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

//index
router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampGround,
    catchAsync(campgrounds.createCampground)
  );

//create route
router.get("/new", isLoggedIn, campgrounds.renderNewForm);
//show route
router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampGround,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, catchAsync(campgrounds.deleteCampground));

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

//delete route
module.exports = router;
