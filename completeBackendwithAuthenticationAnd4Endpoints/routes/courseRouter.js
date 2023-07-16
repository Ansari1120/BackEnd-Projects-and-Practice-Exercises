const express = require("express");
const CourseModel = require("../models/CourseModel");
const sendResponse = require("../Helper/Helper");
const Controller = require("../Controller/courseController");
const route = express.Router();

route.get("/", Controller.GetCourse);

route.get("/:id", Controller.SingleCourse);

route.post("/searchStd", Controller.SeachCourseWithPagination);

route.post("/", Controller.PostCourse);

route.get("/search", Controller.SearchCourse);

route.put("/:id", Controller.EditCourse);

route.delete("/:id", Controller.DeleteCourse);

//example http://localhost:5000/api/student/4

module.exports = route;
