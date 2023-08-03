import AddPost from "@/components/AddPost";
import PostsList from "@/components/PostsList";
import { get } from "http";
import React, { cache } from "react";

async function getPosts() {
  const response = await fetch("http://localhost:3000/api/post", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}
const Crud = async () => {
  const data = await getPosts();
  console.log(data);
  return (
    <div className="max-w-4xl mx-auto mt-4">
      <div className="my-5 flex flex-col gap-4">
        <h1 className="text-3xl font-bold">My Custom Crud Apis Post Page</h1>
        <AddPost />
        <PostsList posts={data} />
      </div>
    </div>
  );
};

export default Crud;
