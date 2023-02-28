// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

//cokie parser
const cookieParser = require("cookie-parser");

// Session middleware
const session = require("express-session");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

// Define the helper function
hbs.registerHelper('isChecked', function(value, array) {
    return array.includes(value) ? 'checked' : '';
  });

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
//const capitalize = require("./utils/populate");
const projectName = "SmartCycle";

app.use(cookieParser());
app.use(session({ resave: true, saveUninitialized: true, secret: "secret" }));

app.locals.appTitle = `${projectName}`;

app.use((req, res, next) => {
    res.locals.currentUser = req.session.currentUser;
    next();
})

// 👇 Start handling routes here


const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);
app.use("/auth", require("./routes/auth.routes"));
app.use("/restaurants", require("./routes/restaurant.routes"));
app.use("/shelters", require("./routes/shelter.routes"));
// adding /location means every route in the location.routes file will automatically have /locaton prefixed to the endpoint.
// Must setup all route locations below:
// example - app.use("/auth", require("./routes/auth.routes"));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
