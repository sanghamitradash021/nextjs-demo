import { NextRequest, NextResponse } from "next/server";
import userRepository from "../../../../../lib/repository/userRepository";

/**
 * Retrieves the profile information of a user by their ID.
 * 
 * @param {NextRequest} req - The request object, containing the user ID in the params.
 * @param {Object} params - Route parameters, extracting `id` from the URL.
 * @returns {Promise<NextResponse>} - A promise resolving to the user profile or an error response.
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
        const userId = Number(params.id);
        if (isNaN(userId)) {
            return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
        }

        const user = await userRepository.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching profile", error: error.message }, { status: 500 });
    }
}

/**
 * Updates the profile information of a user.
 * 
 * @param {NextRequest} req - The request object, containing the updated user data in the body.
 * @param {Object} params - Route parameters, extracting `id` from the URL.
 * @returns {Promise<NextResponse>} - A promise resolving to success or error response.
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
        const userId = Number(params.id);
        if (isNaN(userId)) {
            return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
        }

        const body = await req.json();
        const success = await userRepository.update(userId, body);
        if (!success) {
            return NextResponse.json({ message: "Failed to update profile" }, { status: 400 });
        }

        return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error updating profile", error: error.message }, { status: 500 });
    }
}
