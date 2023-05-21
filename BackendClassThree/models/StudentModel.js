const mongoose = require("mongoose")

const StudentModel = mongoose.Schema({
    FirstName:{
        type:String,
        required:true,
    },
    LastName:{
        type:String,
       
    },
    Contact:{
        type:String,
        required:true,
    },
    Courses:{
        type:Number,
        required:true,
    },
})

const studentSchema = mongoose.model('Student',StudentModel)

module.exports = studentSchema




