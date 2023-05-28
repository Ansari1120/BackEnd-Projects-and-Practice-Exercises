import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Post } from "../config/apibasemethod";

function PostCrouse() {
  const [model, setmodel] = useState({});
  const postDataCourses = () => {
    Post("course", model)
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
          label="duration"
          variant="outlined"
          onChange={(e) => {
            setmodel({ ...model, duration: e.target.value });
          }}
        />
        <TextField
          id="outlined-basic"
          label="fees"
          variant="outlined"
          type="number"
          onChange={(e) => {
            setmodel({ ...model, fees: e.target.value });
          }}
        />
        <TextField
          id="outlined-basic"
          label="shortName"
          variant="outlined"
          onChange={(e) => {
            setmodel({ ...model, shortName: e.target.value });
          }}
        />

        <Button variant="contained" onClick={postDataCourses}>
          sent data
        </Button>
      </Box>
    </div>
  );
}

export default PostCrouse;
