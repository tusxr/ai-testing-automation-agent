import { db, TestCasesTable } from "@/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = new URL(req.url).searchParams;
    const repoId = searchParams.get('repoId');
    if (!repoId) {
        return NextResponse.json({ error: 'repoId is required' }, { status: 400 })
    }
    try {
        const result = await db.select().from(TestCasesTable).where(eq(TestCasesTable.repoId, repoId));
        return NextResponse.json(result);
    } catch (e: any) {
        console.error('Error fetching test cases:', e);
        return NextResponse.json({ error: 'Failed to fetch test cases' }, { status: 500 });
    }
}