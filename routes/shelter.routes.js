const express = require("express");
const router = express.Router();
const Shelter = require("../models/shelter.model");


/**
 * GET /shelters/create page
 */
router.get("/create", async (req, res, next) => {
    res.render("shelter-views/create");
});

/**
 * POST /shelters/create  - create a new shelter
 */
router.post("/create", async (req, res, next) => {
    const payload = {
        message: req.body.message,
        phoneNumber: req.body.phoneNumber,
        foodTypes: req.body.foodTypes,
        address: {
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip
        },
        description: req.body.description,
        budget: req.body.budget,
    }
    try {
        // add the author to the payload
        Shelter.create({ ...payload, author: req.session.currentUser._id }).then((shelter) => {
            res.render('shelter-views/details', { shelter: shelter });
        });
    } catch (err) {
        // if session is not valid, redirect to login
        res.redirect('/auth/login');
        next(err);
    }
});

/**
 * GET /shelters/details/:id - list shelter details
 */
router.get("/details/:id", async (req, res, next) => {
    Shelter.findOne({ _id: req.params.id })
        .then(shelter => {
            res.render("shelter-views/details", { shelter: shelter });
        }).catch(err => {
            next(err);
        })
});

/**
 * GET /shelters/edit  - edit shelter details
 */
router.get("/edit/:id", async (req, res, next) => {
    Shelter.findOne({ _id: req.params.id })
        .then(shelter => {
            console.log('shelter: ', shelter);
            res.render("shelter-views/edit", { request: shelter });
        }).catch(err => {
            next(err);
        })
});

/**
 * POST /shelters/update/:id  - updates shelter details
 */
router.post("/update/:id", async (req, res, next) => {
    const payload = {
        message: req.body.message,
        phoneNumber: req.body.phoneNumber,
        foodTypes: req.body.foodTypes,
        address: {
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip
        },
        description: req.body.description,
        budget: req.body.budget,
    }
    try {

        Shelter.findByIdAndUpdate(req.params.id, payload).then(shelter => {
            res.redirect("/shelters");
        })
    } catch (err) {
        res.redirect('/auth/login')
        next(err);
    }
});

/**
 * GET /shelters/delete/:id  - delete shelter
 */
router.get("/delete/:id", async (req, res, next) => {
    Shelter.findByIdAndDelete(req.params.id).then(() => {
        res.redirect("/shelters");
    }, err => {
        next(err);
    });
});

module.exports = router;