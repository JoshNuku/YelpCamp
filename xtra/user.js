const { ref } = require("joi");
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

/* const UserSchema = new mongoose.Schema({
  first: String,
  last: String,
  addresses: [
    { street: String, city: String, Region: String, Country: String },
  ],
});

const User = mongoose.model("User", UserSchema);

const makeUser = async () => {
  const oneUser = new User({
    first: "Josh",
    last: "Nuku",
    addresses: [
      {
        street: "10 Brussels St.",
        city: "Tema",
        Region: "Greater Accra",
        Country: "Ghana",
      },
    ],
  });
  oneUser.save().then((e) => {
    console.log(e, "user created successfully");
  });
};
makeUser();
 */

const productSchema = new Schema({
  name: String,
  price: Number,
  season: {
    type: String,
    enum: ["Spring", "Summer", "Autumn", "Winter"],
  },
});

const Product = mongoose.model("Product", productSchema);

// Product.insertMany([
//   { name: "Orange", price: 4.99, season: "Autumn" },
//   { name: "Watermelon", price: 4.99, season: "Spring" },
//   { name: "Banana", price: 3.99, season: "Summer" },
// ]);

const farmSchema = new Schema({
  name: String,
  city: String,
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

const Farm = mongoose.model("Farm", farmSchema);

/* const makeFarm = async () => {
  try {
    const myFarm = new Farm({ name: "Josh Farms", city: "Tema" });
    const fruit = await Product.findOne({ name: "Orange" });
    myFarm.products.push(fruit);
    const farm = await myFarm.save();
    console.log(farm);
  } catch (e) {
    console.log(e);
  }
};

makeFarm();
 */

Farm.findOne({ name: "Josh Farms" })
  .populate("products")
  .then((res) => console.log(res));
