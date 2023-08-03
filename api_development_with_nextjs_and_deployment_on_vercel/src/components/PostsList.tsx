"use client";
import React, { useState } from "react";
import Modal from "./Modal";
import axios from "axios";
import { useRouter } from "next/navigation";
import Post from "./post";
const PostsList = (props: any) => {
  const router = useRouter();
  const { posts } = props;
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [postToEdit, setPostToEdit] = useState(posts);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    axios
      .patch(`http://localhost:3000/api/post/${posts.id}`, postToEdit)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setOpenModalEdit(false);
        router.refresh();
      });
  };
  return (
    <ol>
      {posts.map((data: any) => {
        return <Post post={data} />;
      })}
    </ol>
  );
};

export default PostsList;
