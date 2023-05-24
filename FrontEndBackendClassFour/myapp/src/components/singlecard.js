import React, { useEffect, useState } from 'react'
import { GetById } from '../config/apibasemethod';
import { useParams } from 'react-router-dom';

function Singlecard() {
    const [course,setCourse] = useState({});
    const {id} = useParams()
    console.log(id)
   
    

  let getApICourseData = () => {
    console.log(id)
    //fetch data
    GetById("course",id)
      .then((res) => {
        console.log(res.data.data);
        setCourse(res);
       

      })
      .catch((err) => {
        console.log(err);
      });
    }
    
    useEffect(()=>{getApICourseData()},[])
  return (
    <div>S</div>
  )
}

export default Singlecard