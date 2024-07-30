const mongoose = require("mongoose");
const { Schema } = mongoose;
main().catch((err) => console.log(err));

//connecting the mongodb
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/seedData");
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const reviewSchema = new Schema({
  body: String,
  rating: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
