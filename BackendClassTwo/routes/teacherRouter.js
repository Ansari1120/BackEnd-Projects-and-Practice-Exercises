const express = require("express")

const route = express.Router();

route.get("/",(req,res)=>{
    res.send("Get All Teacher Data");
})

route.get("/:id",(req,res)=>{
    res.send("Get single Teacher Data");
})

route.post("/",(req,res)=>{
    res.send("Post single Teacher Data");
})

route.put("/:id",(req,res)=>{
    res.send("put single Teacher Data");
})

route.delete("/:id",(req,res)=>{
    res.send("single Teacher Data");
})

module.exports = route