const fs= require('fs')
const http = require('http')

//read directory
// fs.readdir('./',(err,dir)=>{
//     console.log(dir)
// })

//read file


// fs.readFile('./abc.txt','utf-8',(err,file)=>{
//     console.log(file)
// })

//write file

//  fs.writeFile('./abc.txt','Ahmed Ali Ansari Here!',(err)=>{
//    if(err){
//         console.log(err);
//     }
//     else{
//         console.log('write file successfully!');
//     }
// })

//append file 


// fs.appendFile('./abc.txt',"\n im from karachi Pakistan",(err)=>{
//     if(err){
//  console.log(err)
//     }
//     else{
//         console.log('append done')
//     }
// })



// traditional node working with rest api
//thunder client and postman for api testing we can use

const courses = [
    {
        id:1,
        name:"ABC",
    },
    {
        id:2,
        name:"asd",
    },
    {
        id:2,
        name:"ABC",
    },
    {
        id:3,
        name:"ABC",
    },
]

// const server = http.createServer((req,res)=>{
//     // if(req.url == '/Ahmed'){
//     //     res.write(JSON.stringify(courses))
//     // }
//     // else if(req.url == '/courses'){
//     //     res.write(JSON.stringify(courses))
//     // }

//     if(req.url== '/Ahmed'){
//         if(req.method == 'GET'){
//             res.write(JSON.stringify(courses))
//         } else if(req.method == 'POST'){
//             res.write(JSON.stringify(req.body))
//         }
//     }
//     res.end()
// })

// server.listen(5000)


// code becomes lengthy with simple backend working with node js so we can use express js here
//add npm init
// npm i express

// req recieve actions from client side and res send result from server side to client side.
const express = require('express')
const app = express();


app.get('/courses',(req,res)=>{
    res.json(courses)
})
app.get("/courses/:id",(req,res)=>{
    let id = req.params.id;
    let obj = courses.find((x)=>x.id== id);
    if(obj){
        res.send(obj).status(200);
    }
    else{
        res.send('No Data Found').status(404);
    }
})

app.post('/courses',(req,res)=>{});
app.put('/courses/:id',(req,res)=>{});
app.post('/courses/:id',(req,res)=>{});

app.listen(5000)


//make remaining requests make thier apis.