// Node JS k basic Concepts

// console.log("Hello World") //node server.js (for run)

// const fs = require("fs");

// ====== Read DIrectory ===
// fs.readdir('./',(err,dir)=>{
//     console.log(dir)
// })

// === Read File =====
// fs.readFile('./abc.txt',"utf-8",(err,file)=>{
//     console.log(file)
// })

// ===== WRite File ======
// fs.writeFile('./abc.txt',"Hamza Kamelen here",(err)=>{
//     if(err){
//         console.log(err)
//     }else{
//         console.log("Write Done")
//     }
// })

// ====== Append File=====
// fs.appendFile('./abc.txt',"\n New Text from Hamza",(err)=>{
//     if(err){
//                 console.log(err)
//             }else{
//                 console.log(" Appended Done")
//             }
// })
// let book = [
//   {
//     id: 1,
//     name: "Hamza",
//   },
//   {
//     id: 2,
//     name: "Talha",
//   },
//   {
//     id: 3,
//     name: "Anas",
//   },
// ];
// const http = require('http')
// const server = http.createServer((req,res)=>{
//     console.log("CHal gya")
//     console.log("Url",req.url)
//     if(req.url=="/hamzakamelen"){
//         res.write(JSON.stringify(a))
//     }else if(req.url=="/hamza"){
//         res.write(JSON.stringify(a))
//     }

//     if(req.url=="/hamzakamelen"){
//         if(req.method=="GET"){
//             res.write(JSON.stringify(a))
//         } else if(req.method=="POST"){
//             res.write(JSON.stringify(req.body))
//         }
//     }
//     res.end()
// })
// server.listen(5000);

//Postman download krna h usmain humn sari API test krskty h
//Thunder Client in VS Extension

// ---------------- Ye Sab Node ka tha ab hum express krengy-----------------------------

// for middle ware
//npm init
// enter krty rhna
// npm i express
// npm start

// const express = require("express")
// const app = express()
// // Middle ware
// app.use(express.json());
// // ------------------
// app.get("/hamza",(req,res)=>{
//     // yahan bar bar server band krny ki zrurat nahi y khud krlega handle
//     res.send(JSON.stringify(a))
// })
// app.post("/hamza",(req,res)=>{
//     res.send(JSON.stringify(req.body))
// })
// app.put("/hamza",(req,res)=>{})
// app.delete("/hamza",(req,res)=>{})

// app.listen(5000)

// const express = require("express")
// const app = express();

// app.get("/coruse", (req,res) => {
//     res.send(book)
// })

// app.get("/chalja/:id", (req,res) => {
//     let id = req.params.id
//     let obj = book.find((x) => x.id == id);
//     if(obj){
//         res.send(obj).status(200)
//     } else {
//         res.send("No data found").status(404)
//     }
// })

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const StudentRouter = require("./routes/studentRouter");
const TeacherRouter = require("./routes/teacherRouter");
const InstituteRouter = require("./routes/instituteRouter");
const courseRouter = require("./routes/courseRouter");
const userRoutes = require("./routes/userRoutes");
const app = express();
app.use(express.json());
app.use(cors());
// Serve static files from the "storage" directory
app.use("/storage", express.static(path.join(__dirname, "storage")));

// ... your other routes

app.use("/api/student", StudentRouter);
app.use("/api/teacher", TeacherRouter);
app.use("/api/institute", InstituteRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Server Started");
});

// Make sure to include this route to handle other routes
app.get("*", (req, res) => {
  res.status(404).send("Not Found");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        "Database Connected Successfully and server is listening on this port 5000"
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });

//npm i -g nodemon
//install  this liberary to get rid of starting and ending server again and again after some changes.
//npm i .env
//create new account for mongo db
//from this url : https://www.mongodb.com/atlas/database
//how to connect mongo db
//select driver option
//copy mongo_url and past it into .env file
//npm i mongoose to establish connection with mongo db.
//username : Ansari1120
//password: 1o6kifilit
//npm install mongodb

//task
//make models and thier schema of remaining routes
