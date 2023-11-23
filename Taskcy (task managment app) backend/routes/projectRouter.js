const express = require("express");
const Controller = require("../Controller/projectController");
const route = express.Router();

route.get("/", Controller.getProjects);
route.get("/searchRegister", Controller.SearchCourse);
route.post("/", Controller.postProject);
route.post("/createLabel", Controller.createLabel);

module.exports = route;
