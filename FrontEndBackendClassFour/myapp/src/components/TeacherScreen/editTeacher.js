import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Box, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { Put } from "../../config/apibasemethod";

function EditTeacher() {
  const { id } = useParams();
  const [model, setmodel] = useState({});
  console.log(id);

  const editCourseData = () => {
    Put("teacher", id, model)
      .then(() => {
        console.log("data edited successfully");
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
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
        <Button variant="contained" onClick={editCourseData}>
          Edit data
        </Button>
      </Box>
    </>
  );
}

export default EditTeacher;
