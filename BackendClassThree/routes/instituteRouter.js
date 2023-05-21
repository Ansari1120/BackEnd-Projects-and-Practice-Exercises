const express = require("express")

const route = express.Router();

route.get("/",(req,res)=>{
    res.send("Get All Institute Data");
})

route.get("/:id",(req,res)=>{
    res.send("Get single Institute Data");
})

route.post("/",(req,res)=>{
    res.send("Post single Institute Data");
})

route.put("/:id",(req,res)=>{
    res.send("put single Institute Data");
})

route.delete("/:id",(req,res)=>{
    res.send("single Institute Data");
})

module.exports = route