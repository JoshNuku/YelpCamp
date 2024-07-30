const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const AppError = require("./utils/appError");
const campgroundRoutes = require("./routes/campground");
const reviewsRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");
const User = require("./models/user");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.use(morgan("tiny")); // middleware to log http method and route to console

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

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs"); // set views engine to ejs

app.use(express.urlencoded({ extended: true })); // parse the body to an object
app.use(methodOverride("_method")); // fake the delete and put requests as post in html

const sessionConfig = {
  secret: "thisisasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

//auth with passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine("ejs", ejsMate); //creating a common layout for the views

app.use(express.static(path.join(__dirname, "public"))); //render static public files ,css/js

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//express-router routes
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => res.render("home"));

//sample middleware
/*
const verifyPassword = (req, res, next) => {
  //query string password
  const { password } = req.query;
  if (password === "chickennugget") {
    next();
  }
  throw new AppError("password required", 401);
};
app.get("/secret", verifyPassword, (req, res) => {
  // /secret?password=chickennugget
  res.send("I have a secret");
});*/

//error handling
app.all("*", (req, res, next) => {
  next(new AppError("Page not found", 404));
});
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh no, something went wrong";
  res.status(status).render("error", { err });
});

//Start server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
