import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(new URL('/workspace?error=Code not found', req.url))

    }
    const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID!,
            client_secret: process.env.GITHUB_CLIENT_SECRET!,
            code: code,
            // redirect_uri: process.env.GITHUB_REDIRECT_URI
        })
    })
    const data = await res.json();
    const token = data.access_token;
    if (!token) {
        return NextResponse.redirect(new URL('/workspace?error=Failed to fetch token', req.url))
    }
    const response = NextResponse.redirect(new URL('/workspace', req.url));

    //store token in http-only cookuie

    response.cookies.set('gh-token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 30, sameSite: 'lax', path: '/' })

    return response;
}