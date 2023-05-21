const express = require("express")

const route = express.Router();

route.get("/",(req,res)=>{
    res.send("Get All Student Data");
})

route.get("/:id",(req,res)=>{
    res.send("Get single Student Data");
})

route.post("/",(req,res)=>{
    res.send("Post single Student Data");
})

route.put("/:id",(req,res)=>{
    res.send("put single Student Data");
})

route.delete("/:id",(req,res)=>{
    res.send("single Student Data");
})
//example http://localhost:5000/api/student/4

module.exports = route