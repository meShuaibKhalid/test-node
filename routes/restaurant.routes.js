const express = require("express");
const router = express.Router();
const Restaurant = require('../models/restaurant.model')

// Create 

router.get("/create", async (req, res, next) => {
    const restaurants = await Restaurant.find({ author: req.session.currentUser._id });
    res.render("restaurant-views/create", { restaurants: restaurants });
});


router.post('/create', async (req, res, next) => {
    const payload = {
        title: req.body.title,
        phoneNumber: req.body.phoneNumber,
        foodTypes: req.body.foodTypes,
        address: {
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip
        },
        location: {
            lat: req.body.latitude,
            lng: req.body.longitude
        },
        website: req.body.website
    }
    try {
        Restaurant.create({ ...payload, author: req.session.currentUser._id }).then((newRestaurant) => {
            res.render('restaurant-views/details', { restaurant: newRestaurant });
        });
    } catch (err) {
        res.redirect('/auth/login')
        next(err);
    }
})
// Read 

router.get('/details/:restaurantsId', (req, res, next) => {

    Restaurant.findOne({ _id: req.params.restaurantsId })
        .then(restaurant => {
            console.log('restaurant: ', restaurant);
            res.render('../views/restaurant-views/details', { restaurant: restaurant });
        }).catch(err => {
            next(err);
        })
})

router.get('/view', (req, res, next) => {
    Restaurant.find()
        .then(restaurants => {
            res.render('../views/restaurant-views/view', { restaurants: restaurants });
        }).catch(err => {
            next(err);
        })
})

router.get('/edit/:restaurantsId', (req, res, next) => {
    Restaurant.findOne({ _id: req.params.restaurantsId })
        .then(restaurant => {
            console.log('restaurant: ', restaurant);
            res.render('../views/restaurant-views/edit', { restaurant: restaurant });
        }).catch(err => {
            next(err);
        })
})

// Update 

router.post('/update/:restaurantId', (req, res, next) => {
    const payload = {
        title: req.body.title,
        phoneNumber: req.body.phoneNumber,
        foodTypes: req.body.foodTypes,
        address: {
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip
        },
        location: {
            lat: req.body.latitude,
            lng: req.body.longitude
        },
        website: req.body.website
    }

    Restaurant.findOneAndUpdate(req.params.restaurantId, payload)
        .then((updatedRestaurant) => {
            res.redirect(`/restaurants/details/${updatedRestaurant._id}`)
        })
        .catch((err) => next(err));
})

// Delete 

router.post('/delete/:restaurantID/', (req, res, next) => {
    restaurant.findbyIdAndRemove(req.params.restaurantId)
        .then(() => {
            console.log(
                `Restaurant ID ${req.params.restaurantId} has been successfully removed from the DB.`
            );
            res.redirect("/restaurant-views/restaurants");
        })
        .catch((err) => next(err));
})

module.exports = router;
