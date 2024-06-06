const express  =  require("express");
const app = express();
 

const cookieParser = require("cookie-parser");
const path = require('path');
const userModel = require("./models/user.model");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

app.set("view engine","ejs")
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser());


app.get("/",(req,res)=>{
    res.render("index")
})

app.post("/create", (req,res)=>{
    let {username, email , password , age} = req.body;


    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function  (err, hash) {
            let createdUser =  await userModel.create({
                username,
                email,
                password : hash,
                age,
            })
           let token = jwt.sign({email},"secretkey")
           res.cookie("token",token)
            res.render("login")
        });
    })



})


app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login", async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.render("oops");
        }

        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (err) {
                return res.render("oops");
            }
            if (result) {
                const userInfo = {
                    username: user.username,
                    email: user.email,
                    age: user.age
                };
                const token = jwt.sign({ email: user.email }, "secretkey");
                res.cookie("token", token);
                return res.render("webview", { user: userInfo });
            } else {
                return res.render("oops");
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.render("oops");
    }
});


// for logout user 

app.get("/logout",(req,res)=>{
    res.cookie("token","")
    res.redirect("/")
})
app.listen(3000)