import { db, repositories } from "@/db";
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