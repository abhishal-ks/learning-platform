import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

export function requireAuth(req: NextRequest) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized h aap !');
    }

    const token = authHeader.split(' ')[1];

    const payload = verifyToken(token);

    return payload; // { userId }
}