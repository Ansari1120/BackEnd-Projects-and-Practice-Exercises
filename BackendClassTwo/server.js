// Node JS k basic Concepts


// console.log("Hello World") //node server.js (for run)

const fs= require('fs')

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
let book = [
    {
        id:01,
        name:"Hamza"
    },{
        id:02,
        name:"Talha"
    },{
        id:03,
        name:"Anas"
    }
]
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




const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose')
const app = express();
const StudentRouter = require('./routes/studentRouter');
app.use('/api/student',StudentRouter);

mongoose.connect(process.env.MONGO_URI).then(()=>{console.log("database Connected SucessFully")
app.listen(process.env.PORT,()=>{
    console.log('server is listning on 5000')
})
}).catch((err)=>{console.log(err)})





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