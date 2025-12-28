export const runtime = 'nodejs';

import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Password and Email required hai !' },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials h' },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: 'Invalid credentials hai' },
                { status: 401 }
            );
        }

        const token = signToken({ userId: user._id.toString() });

        return NextResponse.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            },
        });
    } catch (err) {
        console.error('Login error, ryty:', err);
        return NextResponse.json(
            { error: 'Internal Server Error hai' },
            { status: 500 }
        );
    }
}