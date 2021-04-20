const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const logger = require('morgan')
const path = require('path')
const passport = require('./helpers/passport')
const bodyParser = require('body-parser')

require('dotenv').config()
const app = express()
const port = process.env.PORT
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("express-session")({
    secret: "Rusty is the worst and ugliest dog in the wolrd",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

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

const index = require('./routes/index')
const auth = require('./routes/auth')
// const admin = require('./routes/admin')

app.use(index)
app.use(auth)
// app.use(admin)

app.listen(80, () => {
    console.log(`Example app listening at :${port}`)
})