"use client";
import React, { useState } from "react";
import Modal from "./Modal";
import axios from "axios";
import { useRouter } from "next/navigation";
interface userType {
  title: string;
  description: string;
}
const AddPost = () => {
  const router = useRouter();
  const [openModal, setOpenModal] = useState<any>(false);
  const [userInput, setUserInput] = useState<userType>({
    title: "",
    description: "",
  });
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/api/post", userInput)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setUserInput({
          title: "",
          description: "",
        });
        setOpenModal(false);
        router.refresh();
      });
  };

  return (
    <div>
      <button
        onClick={() => setOpenModal(true)}
        className="bg-blue-500 text-white p-3 cursor-pointer rounded-md"
      >
        Add New Post
      </button>
      <Modal openModal={openModal} setOpenModal={setOpenModal}>
        <form className="w-full" onSubmit={handleSubmit} >
          <h1 className="text-2xl pb-3">Add New Post</h1>
          <input
            type="text"
            placeholder="title"
            name="Title"
            className="w-full p-2 mb-2 rounded-md"
            value={userInput.title || ""}
            onChange={(e) => {
              setUserInput({ ...userInput, title: e.target.value });
            }}
          />
          <input
            type="text"
            placeholder="description"
            name="Description"
            className="w-full p-2 mb-2 rounded-md"
            value={userInput.description || ""}
            onChange={(e) => {
              setUserInput({ ...userInput, description: e.target.value });
            }}
          />
          <button type="submit" className="bg-blue-700 text-white px-5 py-2 rounded-md">
            Submit
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AddPost;
