const cookieParser = require("cookie-parser");
const express  = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;
const password = 'Akash775647';
let hashval = ""

const app = express()

app.use(cookieParser())
app.get("/",  (req,res)=>{

//    var encp = async()=>{

//     await bcrypt.genSalt(saltRounds,  function(err, salt) {
//         bcrypt.hash(password, salt, function(err, hash) {
//             hashval = hash;
//             console.log(hash);
            
//             bcrypt.compare(password, hashval, function(err, result) {
//                 console.log("the Password is ",result);
                
//             });
//         });
//     });
// }

// encp();
    
    let token = jwt.sign({email: "akashmanjhi00@gmail.com"}, "secret");
     res.cookie("token", token);
    


res.send("Hello World akash")
})




app.get("/read",(req,res)=>{
    let data = jwt.verify(req.cookies.token,"secret");
    res.send("Check")
    console.log(data)
})

app.listen(3000)
