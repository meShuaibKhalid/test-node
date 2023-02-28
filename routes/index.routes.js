const express = require("express");
const router = express.Router();
const Restaurant = require('../models/restaurant.model');
const Shelter = require('../models/shelter.model');

/* GET home page */
// router.get("/", (req, res, next) => {
//   res.render("index");
// });

router.get("/", function (req, res) {
  console.log("req.session====", req.session);
  if (!req.session || !req.session?.currentUser) {
    console.log("No session or current user====");
    res.redirect("/auth/login");
  } else {
    console.log("Session and current user====");
    res.render("index", {
      title: "Home",
      currentUser: req.session.currentUser,
    });
  }
});

router.get("/restaurants", async function (req, res) {
  const restaurants = await Restaurant.find();

  const payload = restaurants.map((restaurant) => {
    restaurant.test = restaurant.foodTypes?.join(", ");
    return restaurant;
  });

  res.render("../views/restaurant-views/restaurants", {
    title: "Restaurants",
    restaurants: payload,
    dataPayload: JSON.stringify(payload),
  });
});


router.get("/shelters", async function (req, res) {
  const shelters = await Shelter.find();
  res.render("../views/shelter-views/shelters", {
    title: "Shleters",
    shelters: shelters,
  });
});


module.exports = router;
