import { db, TestCasesTable } from "@/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { title, description, targetRoute, expectedResult, repoId, testCaseId } = await req.json();

    const result = await db.update(TestCasesTable).set({
        title: title,
        description: description,
        targetRoute: targetRoute,
        expectedResult: expectedResult,
        repoId: repoId
    }).where(eq(TestCasesTable.id, Number(testCaseId))).returning();

    return NextResponse.json({ success: true, result });
}