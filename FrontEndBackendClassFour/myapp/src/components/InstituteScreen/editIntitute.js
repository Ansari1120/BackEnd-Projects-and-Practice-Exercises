import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Box, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { Put } from "../../config/apibasemethod";

function EditIntitute() {
  const { id } = useParams();
  const [model, setmodel] = useState({});
  console.log(id);

  const editCourseData = () => {
    Put("institute", id, model)
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

        <Button variant="contained" onClick={editCourseData}>
        Edit data
        </Button>
      </Box>
    </>
  );
}

export default EditIntitute;
