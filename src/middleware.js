import { NextResponse } from 'next/server'
import { rateLimit } from '@daveyplate/next-rate-limit'

export async function middleware(request) {
    const response = NextResponse.next()

    return await rateLimit({ request, response, sessionLimit: 16, ipLimit: 16 })
}

// Apply middleware to all API routes
export const config = {
    matcher: '/api/:path*'
}