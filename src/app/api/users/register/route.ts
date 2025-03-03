import { NextRequest, NextResponse } from "next/server";
import userRepository from "../../../../lib/repository/userRepository";
// import user from "../../../../db/models/user";

/**
 * Registers a new user.
 * 
 * @param {NextRequest} req - The request object, containing the user registration data in the body.
 * @returns {Promise<NextResponse>} - A promise indicating the completion of the operation.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
    // await user.sync({ force: true })
    try {
        const body = await req.json(); // Extract request body
        const { email } = body;

        const userExists = await userRepository.findByEmail(email);
        if (userExists) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const user = await userRepository.create(body);
        if (!user) {
            return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
        }

        return NextResponse.json({ message: "Profile created successfully" }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error in registering", error: error.message }, { status: 500 });
    }
}
