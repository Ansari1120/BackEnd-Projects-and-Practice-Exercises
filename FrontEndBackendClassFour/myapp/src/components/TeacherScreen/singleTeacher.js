import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetById } from "../../config/apibasemethod";

function SingleTeacher() {
  const [course, setCourse] = useState({});
  const { id } = useParams();
  console.log(id);

  let getApICourseData = () => {
    console.log(id);

    //fetch data
    GetById("teacher", id)
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
      <div>{course.name}</div>
      <div>{course.course}</div>
      <div>{course.contact}</div>
    </>
  );
}

export default SingleTeacher;
