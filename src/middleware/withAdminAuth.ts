
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export function withAdminAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      const tokenData = getDataFromToken(request);
      if (tokenData.role !== "admin") {
        return NextResponse.json(
          { message: "Forbidden: Admins only" },
          { status: 403 }
        );
      }
      return handler(request, ...args);
    } catch (error: any) {
      return NextResponse.json({ message: "Unauthorized: Invalid or expired token" }, { status: 401 });
    }
  };
}
