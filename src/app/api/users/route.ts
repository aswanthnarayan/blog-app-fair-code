
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { withAdminAuth } from "@/middleware/withAdminAuth";

async function getAllUsers(request: NextRequest) {
  await dbConnect();
  try {
    const users = await User.find({}).select("-password");
    return NextResponse.json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(getAllUsers);
