export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { connectDB } from "@/lib/mongodb";
import Content from "@/models/Content";
import Chapter from "@/models/Chapter";

// IMPORTANT: register models for populate safety
import "@/models/User";



export async function POST(
    req: NextRequest,
    context: { params: Promise<{ contentId: string }> }
) {
    try {
        const { contentId } = await context.params;
        const user = requireAuth(req);
        const { title, body, order } = await req.json();

        if (!title || !body) {
            return NextResponse.json(
                { error: "Title and body are required h ji !" },
                { status: 400 }
            );
        }

        await connectDB();

        const content = await Content.findById(contentId);

        if (!content) {
            return NextResponse.json(
                { error: "Content not found ji !" },
                { status: 404 }
            );
        }

        // ownership check
        if (content.author.toString() !== user.userId) {
            return NextResponse.json(
                { error: "Not authorized ho ji aap !" },
                { status: 403 }
            );
        }

        const chapter = await Chapter.create(
            {
                title,
                body,
                order: order ?? 0,
                content: content._id,
            }
        );

        return NextResponse.json(chapter, { status: 201 });

    } catch (err) {
        console.error('GET CHAPTERS ERROR Ryty:', err);
        return NextResponse.json(
            { error: "Failed to fetch chapters" },
            { status: 500 }
        );
    }
}


export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ contentId: string }> }
) {
    try {
        const { contentId } = await context.params;

        await connectDB();

        const chapters = await Chapter.find({ content: contentId })
            .sort({
                order: 1,
                createdAt: 1
            });

        return NextResponse.json(chapters);

    } catch (err) {
        console.error('GET CHAPTERS ERROR ji:', err);
        return NextResponse.json(
            { error: "Failed to fetch chapters" },
            { status: 500 }
        );
    }
}