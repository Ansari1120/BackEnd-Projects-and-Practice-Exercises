const express = require("express");
const Controller = require("../Controller/courseController");
const route = express.Router();

route.get("/", Controller.GetCourse);

route.get("/searchStd", Controller.SeachCourseWithPagination);

route.get("/search", Controller.SearchCourse);

route.get("/:id", Controller.SingleCourse);

route.post("/", Controller.PostCourse);

route.put("/:id", Controller.EditCourse);

route.delete("/:id", Controller.DeleteCourse);

//example http://localhost:5000/api/student/4

module.exports = route;
