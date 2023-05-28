import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Post } from "../../config/apibasemethod";

function PostIntitute() {
  const [model, setmodel] = useState({});
  const postDataCourses = () => {
    Post("institute", model)
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
          label="address"
          variant="outlined"
          onChange={(e) => {
            setmodel({ ...model, address: e.target.value });
          }}
        />
        <TextField
          id="outlined-basic"
          label="shortName"
          variant="outlined"
          type="number"
          onChange={(e) => {
            setmodel({ ...model, shortName: e.target.value });
          }}
        />
        <TextField
          id="outlined-basic"
          label="tel"
          variant="outlined"
          onChange={(e) => {
            setmodel({ ...model, tel: e.target.value });
          }}
        />

        <Button variant="contained" onClick={postDataCourses}>
          sent data
        </Button>
      </Box>
    </div>
  );
}

export default PostIntitute;
