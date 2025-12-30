export const runtime = "nodejs";

import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";
import Chapter from "@/models/Chapter";
import Content from "@/models/Content";
import Mcq from "@/models/Mcq";
import { NextRequest, NextResponse } from "next/server";
import '@/models/User';



export async function POST(
    req: NextRequest,
    context: { params: Promise<{ chapterId: string }> }
) {
    try {
        const { chapterId } = await context.params;
        const user = requireAuth(req);

        const { question, options, correctIndex } = await req.json();

        if (
            !question ||
            !Array.isArray(options) ||
            options.length < 2 ||
            typeof correctIndex !== 'number'
        ) {
            return NextResponse.json(
                { error: 'Invalid MCQ data h ji' },
                { status: 400 }
            );
        }

        await connectDB();

        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            return NextResponse.json(
                { error: 'Chapter not found ji' },
                { status: 404 }
            );
        }

        // verify ownership via content
        const content = await Content.findById(chapter.content);
        if (!content || content.author.toString() !== user.userId) {
            return NextResponse.json(
                { error: 'Not authorized ho ji aap' },
                { status: 403 }
            );
        }

        const mcq = await Mcq.create(
            {
                question,
                options,
                correctIndex,
                chapter: chapter._id
            }
        );

        return NextResponse.json(mcq, { status: 201 });

    } catch (err) {
        console.error('CREATE MCQ ERROR for Ryty:', err);
        return NextResponse.json(
            { error: "Failed to create MCQ" },
            { status: 500 }
        );
    }
}


export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ chapterId: string }> }
) {
    try {
        const { chapterId } = await context.params;

        await connectDB();

        const mcqs = await Mcq.find({ chapter: chapterId });

        return NextResponse.json(mcqs);

    } catch (err) {
        console.error("GET MCQS ERROR for Ryty:", err);
        return NextResponse.json(
            { error: "Failed to fetch MCQs" },
            { status: 500 }
        );
    }
}