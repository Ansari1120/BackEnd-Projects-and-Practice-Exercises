import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import React from "react";
import TextField from "@mui/material/TextField";
import { Del, Get } from "../../config/apibasemethod";

function Institute() {
  const [course, setCourse] = useState([]);
  const [model, setmodel] = useState({});

  let getApICourseData = () => {
    //fetch data
    Get("/institute")
      .then((res) => {
        console.log(res.data.data);
        setCourse([...res.data.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let delApICourseData = (id) => {
    console.log(id);
    //fetch data
    Del("institute", id)
      .then(() => {
        console.log("deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getApICourseData();
  }, []);

  const navigate = useNavigate();
  const chnagepage = (id) => {
    navigate(`/singleInstitute/${id}`);
  };

  const style = {
    top: "0%",
    left: "0%",
    margin: "40px 10px",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const putdataInstitute = (id) => {
    console.log(id);
    navigate(`/EditIntitute/${id}`);
  };

  return (
    <div className="App">
      {course.map((x) => (
        <Container maxWidth="sm">
          <Card
            sx={{
              minWidth: 175,
              marginTop: "25px",
              background: "gray",
              color: "white",
            }}
          >
            <CardContent>
              <Typography
                sx={{ fontSize: 24, color: "white" }}
                color="text.secondary"
                gutterBottom
              >
                {x.name}
              </Typography>
              <Typography variant="h5" sx={{ color: "white" }} component="div">
                {x.address}
              </Typography>
              <Typography
                sx={{ mb: 1.5, color: "white" }}
                color="text.secondary"
              >
                {x.shortName}
              </Typography>
              <Typography sx={{ color: "white" }} variant="h6">
                {x.tel}
                <br />
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => chnagepage(x._id)}>
                singlepage
              </Button>
            </CardActions>
            <CardActions>
              <Button size="small" onClick={() => delApICourseData(x._id)}>
                delete{" "}
              </Button>
              <Button
                variant="contained"
                onClick={() => putdataInstitute(x._id)}
              >
                 Edit data
              </Button>
            </CardActions>
          </Card>
        </Container>
      ))}
    </div>
  );
}

export default Institute;
