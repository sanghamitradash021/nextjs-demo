import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import userRepository from "../../../../lib/repository/userRepository"; // Adjust the path based on your structure
import user from "../../../../db/models/user"

export async function POST(req: NextRequest) {
    // await user.sync({ force: true })
    try {
        console.log('Login request received:', JSON.stringify(req.body, null, 2));
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



// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { OAuth2Client } from "google-auth-library";
// import userRepository from "../../../../lib/repository/userRepository";
// import user from "../../../../db/models/user";

// // Create a Google OAuth2 client
// const googleOAuthClient = new OAuth2Client(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URI // Optional, but recommended
// );

// export async function POST(req: NextRequest) {
//     try {
//         const body = await req.json();
//         const { email, password, googleToken } = body;

//         // Existing email/password authentication
//         if (email && password) {
//             const user = await userRepository.validateCredentials(email, password);
//             if (!user) {
//                 return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
//             }

//             const token = jwt.sign(
//                 { id: user.user_id, email: user.email },
//                 process.env.JWT_SECRET || "secret",
//                 { expiresIn: "1d" }
//             );

//             return NextResponse.json({
//                 user: {
//                     id: user.user_id,
//                     username: user.username,
//                     email: user.email,
//                     fullname: user.fullname,
//                 },
//                 token,
//             });
//         }

//         // Google OAuth authentication
//         if (googleToken) {
//             try {
//                 // Verify the Google ID token
//                 const ticket = await googleOAuthClient.verifyIdToken({
//                     idToken: googleToken,
//                     audience: process.env.GOOGLE_CLIENT_ID,
//                 });

//                 const payload = ticket.getPayload();
//                 if (!payload) {
//                     return NextResponse.json({ message: "Invalid Google token" }, { status: 400 });
//                 }

//                 const { email, name, sub: googleId } = payload;

//                 if (!email) {
//                     return NextResponse.json({ message: "No email found in Google profile" }, { status: 400 });
//                 }

//                 // Find or create user based on Google email/ID
//                 let user = await userRepository.findByEmail(email);
                
//                 if (!user) {
//                     // Create a new user if not exists
//                     user = await userRepository.create({
//                         email,
//                         username: email.split('@')[0],
//                         fullname: name,
//                         googleId,
//                         // You might want to add a random password or handle this differently
//                         password: null 
//                     });
//                 }

//                 // Generate JWT token for the user
//                 const token = jwt.sign(
//                     { id: user.user_id, email: user.email },
//                     process.env.JWT_SECRET || "secret",
//                     { expiresIn: "1d" }
//                 );

//                 return NextResponse.json({
//                     user: {
//                         id: user.user_id,
//                         username: user.username,
//                         email: user.email,
//                         fullname: user.fullname,
//                     },
//                     token,
//                 });

//             } catch (googleAuthError) {
//                 console.error('Google authentication error:', googleAuthError);
//                 return NextResponse.json({ message: "Google authentication failed" }, { status: 401 });
//             }
//         }

//         // If neither email/password nor Google token is provided
//         return NextResponse.json({ message: "Authentication method required" }, { status: 400 });

//     } catch (error) {
//         console.error('Login error:', error);
//         return NextResponse.json({ message: "Error logging in", error }, { status: 500 });
//     }
// }