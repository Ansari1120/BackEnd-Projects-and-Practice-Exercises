import prisma from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "url";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { title, description, imageSrc, authorImg, authorName, blogLikes } =
      body;
    const newPost = await prisma.post.create({
      data: {
        title,
        description,
        imageSrc,
        authorImg,
        authorName,
        blogLikes,
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 400 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const parsedUrl = parse(req.url, true);
    const user: any = parsedUrl.query.user;
    if (!user) {
      return NextResponse.json(
        {
          message: "Please Enter Your Admin Id To see Your Added Blogs",
        },
        {
          status: 204,
        }
      );
    }
    const newPost = await prisma.post.findMany({
      where: {
        authorName: user,
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 400 }
    );
  }
};
