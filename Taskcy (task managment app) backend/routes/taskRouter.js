const express = require("express");
const Controller = require("../Controller/taskController");
const route = express.Router();

route.get("/", Controller.GetTasks);
route.post("/", Controller.PostTask);
route.post("/createLabel", Controller.CreateLabel);
route.patch("/move", Controller.MoveTaskToLabel);
route.patch("/:id", Controller.UpdateTask);

module.exports = route;
