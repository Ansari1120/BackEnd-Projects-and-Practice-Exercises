import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetById } from "../../config/apibasemethod";

function Studentcard() {
  const [course, setCourse] = useState({});
  const { id } = useParams();
  console.log(id);

  let getApICourseData = () => {
    console.log(id);
    //fetch data
    GetById("student", id)
      .then((res) => {
        console.log(res.data.data);
        setCourse(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getApICourseData();
  }, []);
  return (
    <>
      <div>{course.duration}</div>
      <div>{course.fees}</div>
      <div>{course.name}</div>
      <div>{course.shortName}</div>
    </>
  );
}

export default Studentcard;
