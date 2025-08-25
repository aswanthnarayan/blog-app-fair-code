import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";

const updatePostSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
});


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const post = await Post.findById(params.id).populate("author", "name email");
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error("Get single post error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const tokenData = getDataFromToken(request);
    const body = await request.json();
    const { title, content } = updatePostSchema.parse(body);

    const post = await Post.findById(params.id);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (post.author.toString() !== tokenData.userId && tokenData.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    const updatedPost = await post.save();

    return NextResponse.json({
      message: "Post updated successfully",
      post: updatedPost,
    });
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
    console.error("Update post error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const tokenData = getDataFromToken(request);
    const post = await Post.findById(params.id);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (post.author.toString() !== tokenData.userId && tokenData.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Post.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error: any) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return NextResponse.json({ message: "Unauthorized: Invalid or expired token" }, { status: 401 });
    }
    console.error("Delete post error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
