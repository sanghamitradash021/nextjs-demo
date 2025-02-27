import { NextRequest, NextResponse } from "next/server";
import userRepository from "../../../../../lib/repository/userRepository";

/**
 * Deletes a user by their ID.
 * 
 * @param {NextRequest} req - The request object, containing the user ID in the params.
 * @param {Object} params - Route parameters, extracting `id` from the URL.
 * @returns {Promise<NextResponse>} - A promise resolving to a success or error response.
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
        const userId = Number(params.id);
        if (isNaN(userId)) {
            return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
        }

        const success = await userRepository.delete(userId);
        if (!success) {
            return NextResponse.json({ message: "Failed to delete user" }, { status: 400 });
        }

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error deleting user", error: error.message }, { status: 500 });
    }
}
