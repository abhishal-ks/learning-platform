export const runtime = 'nodejs';

import { requireAuth } from "@/lib/requireAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = requireAuth(req);

        return NextResponse.json(
            {
                message: 'Authenticated ho ji aap',
                userId: user.userId,
            }
        );
        
    } catch {
        return NextResponse.json(
            { error: 'Unauthorized ho ji aap !' },
            { status: 401 }
        );
    }
}