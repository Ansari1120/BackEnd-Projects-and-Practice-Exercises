const sendResponse = require("../Helper/Helper");
const TaskModel = require("../models/TaskModel");
const ProjectModel = require("../models/ProjectModel");
const TaskLabelAssociationModel = require("../models/task_LabelAssociation");
const LabelModel = require("../models/LabelModel"); // Import the Label model

const Controller = {
  GetTasks: async (req, res) => {
    try {
      let { page, limit, sort, asc, DueDate, userId } = req.query;
      if (!page) page = 1;
      if (!limit) limit = 40;

      const skip = (page - 1) * limit;
      // Create a filter object based on the optional DueDate parameter

      const filter = {};
      if (DueDate) {
        filter.DueDate = DueDate;
      }

      if (userId) {
        // Assuming userId is provided as a string in the request query
        // Use $or to match tasks with CreatorUserID or TeamMembers containing the userId
        filter.$or = [
          { CreatorUserID: userId},
          { TeamMembers: userId },
        ];
      }

      const result = await TaskModel.find(filter)
        .sort({ [sort]: asc })
        .skip(skip)
        .limit(limit)
        .populate("projectId")
        .populate("Labels");
      if (!result) {
        res.send(sendResponse(false, null, "No Data Found")).status(404);
      } else {
        res
          .send(sendResponse(true, result, "Data Found", "", page, limit))
          .status(200);
      }
    } catch (e) {
      console.log(e);
      res.send(sendResponse(false, null, "Server Internal Error")).status(500);
    }
  },

  PostTask: async (req, res) => {
    const {
      Title,
      Description,
      DueDate,
      Priority,
      Status,
      CreatorUserID,
      TeamMembers,
      projectId,
    } = req.body;
    try {
      let errArr = [];

      //validation Part
      if (!Title) {
        errArr.push("Required Title");
      }
      if (!Description) {
        errArr.push("Required Description");
      }
      if (!DueDate) {
        errArr.push("Required DueDate");
      }
      if (!Priority) {
        errArr.push("Required Priority");
      }
      if (!Status) {
        errArr.push("Required Status");
      }
      if (!CreatorUserID) {
        errArr.push("Required CreatorUserID");
      }
      if (!projectId) {
        errArr.push("Required projectId");
      }
      if (!TeamMembers) {
        errArr.push("Required TeamMembers");
      }

      if (errArr.length > 0) {
        res
          .send(sendResponse(false, errArr, null, "Required All Fields"))
          .status(400);
        return;
      } else {
        let obj = {
          Title,
          Description,
          DueDate,
          Priority,
          Status,
          CreatorUserID,
          TeamMembers,
          projectId,
        };
        let Task = new TaskModel(obj);
        await Task.save();
        if (!Task) {
          res.send(sendResponse(false, null, "Data Not Found")).status(404);
        } else {
          await ProjectModel.findByIdAndUpdate(
            obj.projectId,
            { $push: { tasks: Task._id } },
            { new: true }
          );
          res.send(sendResponse(true, Task, "Save Successfully")).status(200);
        }
      }
    } catch (e) {
      console.log(e);
      res.send(sendResponse(false, null, "Internal Server Error")).status(400);
    }
  },

  UpdateTask: async (req, res) => {
    try {
      const taskId = req.params.id;
      const { Status, Priority } = req.body;
      if (!Status && !Priority) {
        return res
          .send(
            sendResponse(false, null, "Provide Status or Priority for update.")
          )
          .status(400);
      }
      const updatedFields = {};
      if (Status) {
        updatedFields.Status = Status;
      }
      if (Priority) {
        updatedFields.Priority = Priority;
      }
      const updatedTask = await TaskModel.findByIdAndUpdate(
        taskId,
        { $set: updatedFields },
        { new: true }
      );
      if (!updatedTask) {
        return res
          .send(sendResponse(false, null, "Task not found."))
          .status(404);
      }
      res
        .send(sendResponse(true, updatedTask, "Update Successful"))
        .status(200);
    } catch (err) {
      console.log(err);
      res.send(sendResponse(false, null, "Internal Server Error")).status(500);
    }
  },

  CreateLabel: async (req, res) => {
    const { Name, Color, TaskID } = req.body;

    try {
      if (!Name || !Color || !TaskID) {
        return res
          .send(
            sendResponse(false, null, "Name, Color, and TaskID are required.")
          )
          .status(400);
      }
      const label = new LabelModel({ Name, Color, TaskID });
      await label.save();
      await TaskModel.findByIdAndUpdate(
        TaskID,
        { $push: { Labels: label._id } },
        { new: true }
      );
      res
        .send(
          sendResponse(
            true,
            label,
            "Label created and associated with task successfully."
          )
        )
        .status(200);
    } catch (error) {
      console.error(error);
      res.send(sendResponse(false, null, "Internal Server Error")).status(500);
    }
  },

  AssociateTaskWithLabel: async (req, res) => {
    try {
      const { taskId, labelId } = req.body;

      const task = await TaskModel.findById(taskId);
      if (!task) {
        return res
          .send(sendResponse(false, null, "Task not found."))
          .status(404);
      }

      const label = await LabelModel.findById(labelId);
      if (!label) {
        return res
          .send(sendResponse(false, null, "Label not found."))
          .status(404);
      }

      const association = new TaskLabelAssociationModel({
        TaskID: taskId,
        LabelID: labelId,
      });

      await association.save();

      res
        .send(
          sendResponse(
            true,
            association,
            "Task-Label association created successfully."
          )
        )
        .status(200);
    } catch (error) {
      console.error(error);
      res.send(sendResponse(false, null, "Internal Server Error")).status(500);
    }
  },

  MoveTaskToLabel: async (req, res) => {
    try {
      const { taskId, newLabelId, oldLabelId } = req.body;

      const task = await TaskModel.findById(taskId);
      if (!task) {
        return res
          .send(sendResponse(false, null, "Task not found."))
          .status(404);
      }

      const label = await LabelModel.findById(newLabelId);
      if (!label) {
        return res
          .send(sendResponse(false, null, "Label not found."))
          .status(404);
      }

      const oldLabel = await LabelModel.findById(oldLabelId);
      if (!oldLabel) {
        return res.send(
          sendResponse(
            false,
            null,
            "Please Select Label From which you want to move your task"
          )
        );
      }

      if (task.Labels.includes(newLabelId)) {
        return res
          .send(
            sendResponse(
              false,
              null,
              "Task is already associated with the new label."
            )
          )
          .status(400);
      }

      // Remove the old association, if any
      await TaskLabelAssociationModel.deleteOne({
        TaskID: taskId,
        LabelID: oldLabelId,
      });

      // Create a new association with the new label
      const association = new TaskLabelAssociationModel({
        TaskID: taskId,
        LabelID: newLabelId,
      });

      await association.save();

      // Update the task's Labels array from old label Id with the new label ID
      task.Labels = task.Labels.filter(
        (label) => label.toString() !== oldLabelId.toString()
      );
      // now task.labels get its old label from below then old replace is updated by new label
      task.Labels.push(newLabelId);
      await task.save();

      res
        .send(
          sendResponse(true, task, "Task moved to a new label successfully.")
        )
        .status(200);
    } catch (error) {
      console.error(error);
      res.send(sendResponse(false, null, "Internal Server Error")).status(500);
    }
  },
};

module.exports = Controller;
