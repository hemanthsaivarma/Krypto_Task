const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const e = require("express");
const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
/* ============================================= */
mongoose.connect("mongodb://localhost:27017/iwp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log(`connection to database established`)
}).catch(err => {
    console.log(`db error ${err.message}`);
    process.exit(-1)
});
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User = new mongoose.model("User", userSchema);
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    date: String,
    time: String,
    message: String,
});
const Contact = new mongoose.model("Contact", contactSchema);
/* ============================================= */
var n = "";
var em = "";
var p = "";
var d = "";
var t = "";
var m = "";

app.get("/", function (req, res) {
    res.render("login", {
        information: information
    });
});
app.get("/signup", function (req, res) {
    res.render("signup");
});
app.get("/logout", function (req, res) {
    res.render("logout");
});

app.get("/result", function (req, res) {
    res.render("cont", {
        n: n,
        em: em,
        p: p,
        d: d,
        t: t,
        m: m
    });
});
/* ============================================= */
var information = "";

app.post("/login", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        email: email
    }, function (err, founduser) {
        if (err) {
            console.log("error");
        } else {
            if (founduser) {
                if (founduser.password == password) {
                    information = "";
                    res.redirect("/home");
                } else {
                    information = "Incorrect password !!!";
                    res.redirect("/");
                }

            } else {
                information = "Not yet registered !!!";
                res.redirect("/");
            }
        }
    })
});
app.post("/signup", function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({
        email: email
    }, function (err, founduser) {
        if (err) {
            console.log("error");
        } else {
            if (founduser) {
                information = "User already exists !!!";
                res.redirect("/");
            } else {
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password,
                });
                newUser.save(function (error) {
                    if (error) {
                        console.log("error");
                    } else {
                        information = "";
                        res.redirect("/")
                    }
                })
            }
        }
    })
});
/* ============================================= */
app.listen(process.env.PORT || 3000, function () {
    console.log("http://localhost:3000/");
});