import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

export function requireAuth(req: NextRequest) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Response(
            JSON.stringify({ error: 'Unauthorized h aap !' }),
            { status: 401 }
        );
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = verifyToken(token);
        return payload; // { userId }

    } catch {
        throw new Response(
            JSON.stringify({ error: 'Invalid or expired token ji' }),
            { status: 401 }
        );
    }
}