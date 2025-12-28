export const runtime = 'nodejs';

import "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";
import Content from "@/models/Content";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
    try {
        const user = requireAuth(req);
        const { title, description } = await req.json();

        if (!title || !description) {
            return NextResponse.json(
                { error: 'Title and description are required, Ryty' },
                { status: 400 }
            );
        }

        await connectDB();

        const content = await Content.create(
            {
                title,
                description,
                author: user.userId,
            }
        );

        return NextResponse.json(content, { status: 201 });

    } catch (err) {
        return NextResponse.json(
            { error: 'Unauthorized or server error h ji !' },
            { status: 401 }
        );
    }
}


export async function GET() {
    try {
        await connectDB();

        const contents = await Content.find()
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        return NextResponse.json(contents);

    } catch (err) {
        return NextResponse.json(
            { error: 'Failed to fetch content ji !' },
            { status: 500 }
        );
    }
}