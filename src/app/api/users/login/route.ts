import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import userRepository from "../../../../lib/repository/userRepository"; // Adjust the path based on your structure

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        const user = await userRepository.validateCredentials(email, password);
        if (!user) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
        }

        const token = jwt.sign(
            { id: user.user_id, email: user.email },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1d" }
        );

        return NextResponse.json({
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                fullname: user.fullname,
            },
            token,
        });
    } catch (error) {
        return NextResponse.json({ message: "Error logging in", error }, { status: 500 });
    }
}
