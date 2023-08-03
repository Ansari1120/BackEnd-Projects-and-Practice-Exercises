"use client";
import React, { useState } from "react";
import Modal from "./Modal";
import axios from "axios";
import { useRouter } from "next/navigation";
interface userType {
  title: string;
  description: string;
}
const Post = (props: any) => {
  const router = useRouter();
  const { post } = props;
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [postToEdit, setPostToEdit] = useState<userType>({
    title: post.title,
    description: post.description,
  });
  const [openModalDelete, setOpenModalDelete] = useState(false);
  console.log(postToEdit);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    axios
      .patch(`http://localhost:3000/api/post/${post.id}`, postToEdit)
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
  const handleDelete = (postToDelete: any) => {
    axios
      .delete(`http://localhost:3000/api/post/${post.id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setOpenModalDelete(false);
        router.refresh();
      });
  };
  return (
    <li className="p-3 my-5 bg-slate-200" key={post.id}>
      <h1 className="text-2xl font=bold">{post.title}</h1>
      <p>{post.description}</p>
      <div className="pt-5">
        <button
          onClick={() => setOpenModalEdit(true)}
          className="text-blue-500 mr-3"
        >
          Edit
        </button>
        {openModalEdit && (
          <Modal openModal={openModalEdit} setOpenModal={setOpenModalEdit}>
            <form className="w-full" onSubmit={handleSubmit}>
              <h1 className="text-2xl pb-3">Add New Post</h1>
              <input
                type="text"
                placeholder="title"
                name="Title"
                className="w-full p-2 mb-2 rounded-md"
                value={postToEdit.title || ""}
                onChange={(e) => {
                  setPostToEdit((prevState: any) => ({
                    ...prevState,
                    title: e.target.value,
                  }));
                }}
              />
              <input
                type="text"
                placeholder="description"
                name="Description"
                className="w-full p-2 mb-2 rounded-md"
                value={postToEdit.description || ""}
                onChange={(e) => {
                  setPostToEdit((prevState: any) => ({
                    ...prevState,
                    description: e.target.value,
                  }));
                }}
              />
              <button
                type="submit"
                className="bg-blue-700 text-white px-5 py-2 rounded-md"
              >
                Submit
              </button>
            </form>
          </Modal>
        )}

        <button
          onClick={() => setOpenModalDelete(true)}
          className="text-red-500 mr-3"
        >
          Delete
        </button>
        <Modal openModal={openModalDelete} setOpenModal={setOpenModalDelete}>
          <h1 className="text-2xl pb-3">
            Are You Sure You Want to Delete this Post?
          </h1>
          <div>
            <button
              onClick={() => handleDelete(post.id)}
              className="text-blue-700 font-bold mr-5"
            >
              Yes
            </button>
            <button
              onClick={() => setOpenModalDelete(false)}
              className="text-blue-700 font-bold mr-5"
            >
              No
            </button>
          </div>
        </Modal>
      </div>
    </li>
  );
};

export default Post;
