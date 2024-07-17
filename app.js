if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash"); 

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE", err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        // We set above in milliseconds for 7 days.
        // By default a cookie has no expiry date. So generally web browsers unhe tab close krte hi delete kr dega uss cookie ko. 
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // It is by default true and used for security issues.
    }
};

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use(session(sessionOptions));
// Passport session ko use krega as ek session me alag alag pages of same website me browse krne se baar baar local stratergy se ham login nhi krwayenge
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
//A web application needs the ability to identify users as they browse from page to page. This series of requests and responses, each associated with the same user, is known as a session. 
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); 
// serialise means User se related jitni bhi info hai unko session me store karana so that user ko baar baar login nhi krna padega. Jab user login krta tab usse serialise krte.
passport.deserializeUser(User.deserializeUser());
// deserialise means User se related jitni bhi info unko session se remove karana jab user ka session khatam hora ie logout me.

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


//To store fakeUser in our database we use register method (a static async method) jiske andar first parameter fakeUser and second parameter is password. This method also automatically checks if username is unique and not present in the database. Passport ke andar uski khudki hashing algorithm use hoti hai. Hamne "helloworld" password bheja but database me hash value store hua jo passport internally khud se create krra using its hashing algorithm. Object id is always automatically created by our mongoose.

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
    let { statusCode=500, message="Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});