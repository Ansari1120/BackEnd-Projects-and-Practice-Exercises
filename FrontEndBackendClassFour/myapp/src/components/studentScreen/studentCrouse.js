import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Post } from "../../config/apibasemethod";

function StudentCrouse() {
  const [model, setmodel] = useState({});
  const postDataCourses = () => {
    Post("student", model)
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
          label="firstName"
          variant="outlined"
          onChange={(e) => {
            setmodel({ ...model, firstName: e.target.value });
          }}
        />
        <TextField
          id="outlined-basic"
          label="lastName"
          variant="outlined"
          onChange={(e) => {
            setmodel({ ...model, lastName: e.target.value });
          }}
        />
        <TextField
          id="outlined-basic"
          label="password"
          variant="outlined"
          type="number"
          onChange={(e) => {
            setmodel({ ...model, password: e.target.value });
          }}
        />
        <TextField
          id="outlined-basic"
          label="email"
          variant="outlined"
          onChange={(e) => {
            setmodel({ ...model, email: e.target.value });
          }}
        />
        <TextField
          id="outlined-basic"
          label="contact"
          variant="outlined"
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

export default StudentCrouse;
