import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetById } from "../../config/apibasemethod";

function SingleInstitute() {
  const [course, setCourse] = useState({});
  const { id } = useParams();
  console.log(id);

  let getApICourseData = () => {
    console.log(id);

    //fetch data
    GetById("institute", id)
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
      <div>{course.address}</div>
      <div>{course.password}</div>
      <div>{course.shortName}</div>
      <div>{course.tel}</div>
    </>
  );
}

export default SingleInstitute;
