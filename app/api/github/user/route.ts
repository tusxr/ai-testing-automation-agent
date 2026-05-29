import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('gh-token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'No GitHub token' }, { status: 401 });
    }

    const res = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': 'QA-Autopilot/1.0',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        return NextResponse.json({ error: 'Failed to fetch GitHub user' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({
        login: data.login,
        name: data.name,
        avatar_url: data.avatar_url,
    });
}
