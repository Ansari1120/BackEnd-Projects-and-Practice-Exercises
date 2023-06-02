import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import { Put } from "../../config/apibasemethod";

function Studentedit() {
  const { id } = useParams();
  const [model, setmodel] = useState({});
  console.log(id);

  const editCourseData = () => {
    Put("student", id, model)
      .then(() => {
        console.log("data edited successfully");
      })
      .catch((e) => {
        console.log(e);
      });


  };


  console.log(model)
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
            setmodel({ ...model, firstName: e.target.value });
          }}
        />
        <TextField
          id="outlined-basic"
          label="duration"
          variant="outlined"
          onChange={(e) => {
            setmodel({ ...model, lastName: e.target.value });
          }}
        />
        <TextField
          id="outlined-basic"
          label="fees"
          variant="outlined"
          type="number"
          onChange={(e) => {
            setmodel({ ...model, password: e.target.value });
          }}
        />
        <TextField
          id="outlined-basic"
          label="shortName"
          variant="outlined"
          onChange={(e) => {
            setmodel({ ...model, email: e.target.value });
          }}
        />
        <TextField
          id="outlined-basic"
          label="shortName"
          variant="outlined"
          onChange={(e) => {
            setmodel({ ...model, contact: e.target.value });
          }}
        />

        <Button variant="contained" onClick={ editCourseData}>
        Edit data
        </Button>
      </Box>
    </>
  );
}

export default Studentedit;
