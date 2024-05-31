const jwt = require("jsonwebtoken");
const jwt_secret = "ahcdhd";
const express=require("express");

const Router=express.Router();
Router.post("/login",async(req,res)=>{
    const email = req.body.email;
    const token = jwt.sign({ email: email }, jwt_secret);
    if (res.status(201)) {
        return res.json({ status: "ok", data: token })
    }
    else {
        return res.json({ error: "error" });
    }
});
module.exports=Router;
