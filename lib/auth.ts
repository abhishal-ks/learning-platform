import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!;

export interface jwtPayload {
    userId: string;
}



export function signToken(payload: jwtPayload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }
    );
}

export function verifyToken(token: string): jwtPayload {
    return jwt.verify(token, JWT_SECRET) as jwtPayload;
}