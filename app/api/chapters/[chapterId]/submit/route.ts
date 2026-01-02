export const runtime = "nodejs";

import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";
import Chapter from "@/models/Chapter";
import Mcq from "@/models/Mcq";
import { NextRequest, NextResponse } from "next/server";


export async function POST(
    req: NextRequest,
    context: { params: Promise<{ chapterId: string }> }
) {
    try {
        const { chapterId } = await context.params;

        // Auth check
        requireAuth(req);

        const { answers } = await req.json();

        if (!Array.isArray(answers)) {
            return NextResponse.json(
                { error: "Answers must be an array ji" },
                { status: 400 }
            );
        }

        await connectDB();

        // Ensure chapter exists
        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            return NextResponse.json(
                { error: "Chapter not found ji" },
                { status: 404 }
            );
        }

        // Fetch all MCQs for this chapter
        const mcqs = await Mcq.find({ chapter: chapterId });

        const mcqMap = new Map(
            mcqs.map((mcq) => [mcq._id.toString(), mcq])
        );

        let score = 0;
        const results = [];

        for (const answer of answers) {
            const mcq = mcqMap.get(answer.mcqId);

            if (!mcq) continue;

            const isCorrect = mcq.correctIndex === answer.selectedIndex;

            if (isCorrect) score++;

            results.push(
                {
                    mcqId: mcq._id,
                    correct: isCorrect,
                    correctIndex: mcq.correctIndex
                }
            );
        }

        return NextResponse.json({
            score,
            total: mcqs.length,
            results
        });

    } catch (err: any) {
        if (err instanceof Response) {
            return err;
        }

        console.error("SUBMIT ERROR for Ryty:", err);
        
        return NextResponse.json(
            { error: "Failed to evaluate answers ji" },
            { status: 500 }
        );
    }
}