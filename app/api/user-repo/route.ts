import { db, repositories } from "@/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { repoId, userId, name, fullName, private_, description, language, htmlUrl, owner, defaultBranch, targetDomain } = await req.json();
        const result = await db.insert(repositories).values({
            repoId: repoId,
            userId: userId,
            name: name,
            fullName: fullName,
            private: private_ ? 1 : 0,
            description: description,
            language: language,
            htmlUrl: htmlUrl,
            owner: owner,
            defaultBranch: defaultBranch || null,
            targetDomain: targetDomain || null,
        }).returning();
        return NextResponse.json(result[0]);
    } catch (e: any) {
        console.error('Error saving repository:', e);
        return NextResponse.json({ error: 'Failed to save repository' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    try {
        const result = await db.select().from(repositories).where(
            //@ts-ignore
            eq(repositories.userId, Number(userId)));

        // Deduplicate database rows by repoId to filter out any duplicates
        const uniqueResult: typeof result = [];
        const seenRepoIds = new Set<number>();
        for (const row of result) {
            if (!seenRepoIds.has(row.repoId)) {
                seenRepoIds.add(row.repoId);
                uniqueResult.push(row);
            }
        }

        return NextResponse.json(uniqueResult);
    } catch (e: any) {
        console.error('Error fetching user repositories:', e);
        return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, targetDomain } = await req.json();
        if (!id) {
            return NextResponse.json({ error: 'id is required' }, { status: 400 });
        }
        const result = await db.update(repositories)
            .set({ targetDomain })
            .where(eq(repositories.id, id))
            .returning();
        return NextResponse.json({ success: true, repository: result[0] });
    } catch (e: any) {
        console.error('Error updating repository:', e);
        return NextResponse.json({ error: 'Failed to update repository' }, { status: 500 });
    }
}