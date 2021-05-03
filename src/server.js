const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const logger = require('morgan')
const flash = require('connect-flash');
const path = require('path')
const passport = require('./helpers/passport')
const bodyParser = require('body-parser')
const session = require("express-session");
const MongoStore = require("connect-mongo");

require('dotenv').config()
const app = express()
const port = process.env.PORT
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "Skanz",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1209600000
    },
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE
    })
}));


const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}
mongoose
    .connect(process.env.DATABASE, options)
    .then(connected => console.log(`Database connection established !`))
    .catch(err =>
        console.error(
            `There was an error connecting to database, the err is ${err}`
        )
    )

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))

app.use(logger("dev"))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    // res.header("X-powered-by", "Skanz");
    // res.header("server", "Skanz");
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.warning_msg = req.flash('warning_msg');
    res.locals.page_name = "dashboard";
    res.locals.user = req.user || null;
    next();
})
const index = require('./routes/index')
const auth = require('./routes/auth')
const admin = require('./routes/admin')
const users = require('./routes/users');

app.use(index)
app.use(auth)
app.use(admin)
app.use(users);
app.get('*', (req, res, next) => {
    res.status(404).render('404');
    next();
});
app.listen(port, () => {
    console.log(`Example app listening at :${port}`)
})