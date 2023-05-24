import { useEffect, useState } from 'react';
import { Get } from '../config/apibasemethod';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Navbar() {
const [course,setCourse] = useState([]);

  let getApICourseData = () => {
    //fetch data
      Get("/course")
      .then((res) => {
        console.log(res.data.data);
        setCourse([...res.data.data]);
      })
      .catch((err) => {
        console.log(err);
      });
    }
    
    useEffect(()=>{getApICourseData()},[])


    const navigate = useNavigate()
    const chnagepage =(id) => {
      navigate(`/Singlecard/${id}`)

    }

  return (
    <div className="App">
{course.map((x) => (
  <Container maxWidth="sm">
    <Card sx={{ minWidth: 175, marginTop: "25px" , background: "gray" , color: "white"  }}>
  <CardContent>
    <Typography sx={{ fontSize: 24 , color: "white" }} color="text.secondary" gutterBottom>
    {x.duration}
    </Typography>
    <Typography variant="h5" sx={{color: "white"}} component="div">
    {x.fees}
    </Typography>
    <Typography sx={{ mb: 1.5 ,color: "white" }} color="text.secondary">
    {x.name}
    </Typography>
    <Typography sx={{color: "white"}} variant="h6">
    {x.shortName}
      <br />
    
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small" onClick={() => chnagepage(x._id)} >singlepage</Button>
  </CardActions>
</Card>

  </Container>
  

))}



      {/* {course.map((x) => (
        <div> 
          <div>
            {x.duration}
          </div>

          <div>
            {x.fees}
          </div>

          <div>
            {x.name}
          </div>

          <div>
            {x.shortName}
          </div>
           </div>
      ))} */}
     
    </div>
  );
}

export default Navbar;
