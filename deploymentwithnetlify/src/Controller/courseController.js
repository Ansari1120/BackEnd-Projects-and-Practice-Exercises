const CourseModel = require("../models/CourseModel");
const sendResponse = require("../Helper/Helper");

const Controller = {
  GetCourse: async (req, res) => {
    try {
      let { page, limit, sort, asc } = req.query;
      if (!page) page = 1;
      if (!limit) limit = 10;

      const skip = (page - 1) * 10;
      const result = await CourseModel.find()
        .sort({ [sort]: asc })
        .skip(skip)
        .limit(limit);
      if (!result) {
        res.send(sendResponse(false, null, "No Data Found")).status(404);
      } else {
        res
          .send(sendResponse(true, result, "Data Found", "", page, limit))
          .status(200);
      }
    } catch (e) {
      console.log(e);
      res.send(sendResponse(false, null, "Server Internal Error")).status(400);
    }
  },
  SingleCourse: async (req, res) => {
    try {
      let id = req.params.id;
      const result = await CourseModel.findById(id);
      console.log(result);
      if (!result) {
        res.send(sendResponse(false, null, "No Data Found")).status(404);
      } else {
        res.send(sendResponse(true, result, "Data Found")).status(200);
      }
    } catch (e) {
      console.log(e);
      res.send(sendResponse(false, null, "Server Internal Error")).status(400);
    }
  },
  SeachCourseWithPagination: async (req, res) => {
    try {
      const { pageSize, PageNo, searchByVal, searchKey } = req.body;

      let result = await CourseModel.find({ [searchKey]: searchByVal })
        .skip((PageNo - 1) * pageSize)
        .limit(PageNo);

      if (result) {
        res.send(sendResponse(true, result)).status(200);
      } else {
        res.send(sendResponse(false, null, "record not found !")).status(404);
      }
    } catch (error) {
      console.log(error);
      res.send(sendResponse(false, null, "Internal Server Error")).status(400);
    }
  },
  PostCourse: async (req, res) => {
    let { name, duration, fees, shortName } = req.body;
    try {
      let errArr = [];

      //validation Part
      if (!name) {
        errArr.push("Required FirstName");
      }
      if (!duration) {
        errArr.push("Required duration");
      }
      if (!fees) {
        errArr.push("Required fees");
      }
      if (!shortName) {
        errArr.push("Required shortName");
      }

      if (errArr.length > 0) {
        res
          .send(sendResponse(false, errArr, null, "Required All Fields"))
          .status(400);
        return;
      } else {
        let obj = { name, duration, fees, shortName };
        let Course = new CourseModel(obj);
        await Course.save();
        if (!Course) {
          res.send(sendResponse(false, null, "Data Not Found")).status(404);
        } else {
          res.send(sendResponse(true, Course, "Save Successfully")).status(200);
        }
      }
    } catch (e) {
      console.log(e);
      res.send(sendResponse(false, null, "Internal Server Error")).status(400);
    }
    res.send("Post single Student Data");
  },
  SearchCourse: async (req, res) => {
    let { firstName, lastName } = req.body;
    try {
      let result = await CourseModel.find({
        firstName: firstName,
        lastName: lastName,
      });
      if (!result) {
        res.send(sendResponse(false, null, "No Data Found")).status(404);
      } else {
        res.send(sendResponse(true, result), "Data found").status(200);
      }
    } catch (e) {
      res.send(sendResponse(false, null, "Internal Server Error")).status(400);
    }
  },
  EditCourse: async (req, res) => {
    try {
      let id = req.params.id;
      let result = await CourseModel.findById(id);
      if (!result) {
        res.send(sendResponse(false, null, "No Data Found")).status(404);
      } else {
        let updateResult = await CourseModel.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        if (!updateResult) {
          res.send(sendResponse(false, null, "No Data Found")).status(404);
        } else {
          res
            .send(sendResponse(true, updateResult, "Data updated SucessFully"))
            .status(200);
        }
      }
    } catch (e) {
      res.send(sendResponse(false, null, "Internal Server Error")).status(400);
    }
  },
  DeleteCourse: async (req, res) => {
    try {
      let id = req.params.id;
      let result = await CourseModel.findById(id);
      if (!result) {
        res
          .send(sendResponse(false, null, "No Data Found on this id"))
          .status(404);
      } else {
        let deleteById = await CourseModel.findByIdAndDelete(id);
        if (!deleteById) {
          res.send(sendResponse(false, null, "Error")).status(404);
        } else {
          res
            .send(sendResponse(true, deleteById, "Data Deleted SucessFully"))
            .status(200);
        }
      }
    } catch (e) {
      res
        .send(sendResponse(true, deleteById, "Internal Server Error"))
        .status(400);
    }
  },
};

module.exports = Controller;
