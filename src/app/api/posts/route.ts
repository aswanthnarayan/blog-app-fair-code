import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const tokenData = getDataFromToken(request);

    const body = await request.json();
    const { title, content } = postSchema.parse(body);

    const newPost = new Post({
      title,
      content,
      author: tokenData.userId,
    });

    const savedPost = await newPost.save();

    return NextResponse.json(
      {
        message: "Post created successfully",
        post: savedPost,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error },
        { status: 400 }
      );
    }
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return NextResponse.json({ message: "Unauthorized: Invalid or expired token" }, { status: 401 });
    }
    console.error("Create post error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();

  try {
    const posts = await Post.find().populate("author", "name email");
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Get posts error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
