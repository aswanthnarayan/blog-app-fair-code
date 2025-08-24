import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
    try {
        const token = request.headers.get("authorization")?.split(" ")[1] || "";
        const decodedToken:any = jwt.verify(token, process.env.JWT_SECRET!);
        return decodedToken;
    } catch (error: any) {
        throw error;
    }

}