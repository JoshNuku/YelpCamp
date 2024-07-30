const campGround = require("../models/campground");
const moment = require("moment");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { cloudinary } = require("../cloudinary");

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const camp = await campGround.find({});
  res.render("campgrounds/index", { camp });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: "Tema, Ghana",
      limit: 1,
    })
    .send();
  const newCamp = new campGround(req.body.campground);
  newCamp.geometry = geoData.body.features[0].geometry;
  newCamp.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newCamp.author = req.user._id;
  console.log(newCamp);
  await newCamp.save();
  req.flash("success", "Successfully made a new campground");
  res.redirect(`campgrounds/${newCamp._id}`);
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const camp = await campGround
    .findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!camp) {
    req.flash("error", "Cannot Find Campground");
    res.redirect("/campgrounds");
  }

  res.render("campgrounds/show", { camp, moment });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const camp = await campGround.findById(id);
  if (!camp) {
    req.flash("error", "Cannnot find campgound");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { camp });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const data = req.body.campground;
  console.log(req.body);
  data.date = Date.now();
  const camp = await campGround.findByIdAndUpdate(id, data, {
    new: true,
  });
  camp.images.push(
    ...req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }))
  );
  console.log(camp);
  camp.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }

    await camp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  req.flash("success", "Sucessfully updated campground");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await campGround.findByIdAndDelete(id);
  req.flash("success", "Sucessfully deleted campground");
  res.redirect(`/campgrounds`);
};
