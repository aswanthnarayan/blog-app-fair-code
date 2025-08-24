
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { getDataFromToken } from "@/helpers/getDataFromToken";


export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const tokenData = getDataFromToken(request);
    const posts = await Post.find({ author: tokenData.userId }).populate(
      "author",
      "name email"
    );

    return NextResponse.json(posts);
  } catch (error: any) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return NextResponse.json({ message: "Unauthorized: Invalid or expired token" }, { status: 401 });
    }
    console.error("Get user posts error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
