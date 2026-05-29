import { db, repositories } from "@/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { repoId, userId, targetDomain, globalInstruction } = await req.json();
    const result = await db.update(repositories).set({
        targetDomain,
        globalInstruction
    }).where(eq(repositories.repoId, repoId)).returning()
    console.log("result", result)
    return NextResponse.json(result);
}