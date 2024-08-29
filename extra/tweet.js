const mongoose = require("mongoose");
const { Schema } = mongoose;
main().catch((err) => console.log(err));

//connecting the mongodb
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/userData");
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const userSchema = new Schema({
  username: String,
  age: Number,
});

const tweetSchema = new Schema({
  text: String,
  likes: Number,
  user: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.model("User", userSchema);

const Tweet = mongoose.model("Tweet", tweetSchema);

const makeTweets = async () => {
  const tweet = new Tweet({ text: "Great day", likes: 12 });
  /*   const user = new User({ username: "josh119", age: 20 });
  await user.save();
  */
  const user = await User.findOne({});
  tweet.user = user;
  await tweet.save();
  const res = await Tweet.findOne({}).populate("user");
  console.log(res);
};

makeTweets();
