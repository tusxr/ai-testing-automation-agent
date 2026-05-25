import { db, repositories } from "@/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { repoId, userId, name, fullName, private_, description, language, htmlUrl, owner } = await req.json();
    const result = await db.insert(repositories).values({
        repoId: repoId,
        userId: userId,
        name: name,
        fullName: fullName,
        private: private_ ? 1 : 0,
        description: description,
        language: language,
        htmlUrl: htmlUrl,
        owner: owner

    }).returning();
    return NextResponse.json(result[0]);

}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
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
}