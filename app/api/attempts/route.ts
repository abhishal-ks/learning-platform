import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";
import Attempt from "@/models/Attempt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = requireAuth(req);
        await connectDB();

        const attempts = await Attempt.find({ user: user.userId })
            .populate('chapter', 'title')
            .sort({ createdAt: -1 });

        return NextResponse.json(attempts);

    } catch (err) {
        if (err instanceof Response) return err;

        return NextResponse.json(
            { error: 'Failed to fetch attempts ji' },
            { status: 500 }
        );
    }
}