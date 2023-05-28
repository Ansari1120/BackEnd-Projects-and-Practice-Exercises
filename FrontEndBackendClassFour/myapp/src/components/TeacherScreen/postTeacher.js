import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Post } from "../../config/apibasemethod";

function PostTeacher() {
  const [model, setmodel] = useState({});
  const postDataCourses = () => {
    Post("teacher", model)
      .then(() => {
        console.log("data posted sucessfully");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  console.log(model);
  return (
    <div>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          label="name"
          variant="outlined"
          onChange={(e) => {
            setmodel({ ...model, name: e.target.value });
          }}
        />
        <TextField
          id="outlined-basic"
          label="course"
          variant="outlined"
          onChange={(e) => {
            setmodel({ ...model, course: e.target.value });
          }}
        />
        <TextField
          id="outlined-basic"
          label="contact"
          variant="outlined"
          type="number"
          onChange={(e) => {
            setmodel({ ...model, contact: e.target.value });
          }}
        />
        <Button variant="contained" onClick={postDataCourses}>
          sent data
        </Button>
      </Box>
    </div>
  );
}

export default PostTeacher;
