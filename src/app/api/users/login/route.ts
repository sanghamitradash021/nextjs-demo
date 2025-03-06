import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import userRepository from "../../../../lib/repository/userRepository"; // Adjust the path based on your structure
import user from "../../../../db/models/user"

/**
 * Handles the user login request.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} A response containing the user data and a JWT token if authentication is successful, or an error message if not.
 */

export async function POST(req: NextRequest) {
    // await user.sync({ force: true })
    try {
        console.log('Login request received:', JSON.stringify(req.body, null, 2));
        const body = await req.json();
        const { email, password } = body;

        // Validate required fields

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        // Validate user credentials

        const user = await userRepository.validateCredentials(email, password);
        if (!user) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
        }

        // Generate JWT token

        const token = jwt.sign(
            { id: user.user_id, email: user.email },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1d" }
        );
        console.log('Login successful');

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
        console.error('Login error:', error);
        return NextResponse.json({ message: "Error logging in", error }, { status: 500 });
    }
}



