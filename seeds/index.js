const mongoose = require("mongoose");
const cities = require("./cities.js");
const { descriptors, places } = require("./seedhelpers.js");
const campGround = require("../models/campground.js");
// Import the Axios library
const axios = require("axios");
require("dotenv").config();
main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/seedData");
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// Set your API credentials
const accessKey = process.env.UNSPLASH_ACCESS_KEY;
// const secretKey = "XCWhNE1roazH9Wam_qYMJ_OEqcgrFBPYDWvpsbvGzcA";

async function searchPhotos(query) {
  try {
    // Make the API request
    const response = await axios.get(
      `https://pixabay.com/api/?key=16477272-84df86c59f59da088a9d9a790&q=${query}&image_type=photo&pretty=true&per_page=3`
    );
    //console.log(response.data);
    // Process the response data
    const images = response.data.hits.map((photo) => {
      return {
        url: photo.webformatURL,
        filename: query,
      };
    });
    console.log(images);
    return images;
  } catch (error) {
    console.error(error);
  }
}

const title = () =>
  `${descriptors[Math.floor(Math.random() * descriptors.length)]} ${
    places[Math.floor(Math.random() * places.length)]
  }`;

const seedDB = async () => {
  await campGround.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const name = title();
    let random1000 = Math.floor(Math.random() * 1000);
    const coords = [cities[random1000].longitude, cities[random1000].latitude];

    const camps = new campGround({
      author: "66468851d0889610e55ad44d",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: { type: "Point", coordinates: coords },
      title: name,
      images: await searchPhotos(name),
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem ut sunt labore reiciendis commodi vero officia. Mollitia similique distinctio ipsa laboriosam in dolore perferendis pariatur vel dolores impedit, amet nemo.",
      price: Math.floor(Math.random() * 20) + 10,
    });
    await camps.save();
  }
};

seedDB().then(() => mongoose.connection.close());
