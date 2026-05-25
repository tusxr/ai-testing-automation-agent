import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookiesStore = await cookies();
    const token = cookiesStore.get('gh-token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Token not found' }, { status: 404 })
    }
    const allRepos = []
    let page = 1
    while (true) {
        const res = await fetch(`https://api.github.com/user/repos?per_page=100&page=${page}&sort=updated`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch repos' }, { status: 400 })
        }
        const repos = await res.json();
        if (!repos.length) {
            break;
        }
        allRepos.push(...repos)
        page++;
    }
    const mappedRepos = allRepos.map((r: any) => ({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        private_: r.private,
        html_url: r.html_url,
        description: r.description || "",
        default_branch: r.default_branch,
        updated_at: r.updated_at,
        language: r.language || "",
        owner: r.owner?.login || ""
    }));

    return NextResponse.json(mappedRepos);
}