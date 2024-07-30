const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const ImageSchema = new Schema({ url: String, filename: String });
const opts = { toJSON: { virtuals: true } };

ImageSchema.virtual("thumbnail").get(function () {
  console.log(this);
  return this.url?.replace("/upload", "/upload/w_200");
});
const CampGroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    date: {
      type: Date,
      default: Date.now,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

CampGroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

CampGroundSchema.virtual("properties.popUpText").get(function () {
  return `<a href="/campgrounds/${this._id}">${this.title}</a>
  <p> ${this.description.substring(0, 50)}...</p>
  `;
});

module.exports = mongoose.model("Campground", CampGroundSchema);
