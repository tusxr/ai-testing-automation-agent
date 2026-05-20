import { db, users } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const user = await currentUser();

    // Guard: no authenticated session
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress ?? '';
    const name = user.username ?? user.username ?? user.username ?? '';

    try {
        const usersResult = await db.select().from(users).where(eq(users.email, email));

        if (usersResult.length === 0) {
            const newUser = await db.insert(users).values({
                email,
                name,
            }).returning();
            return NextResponse.json({ user: newUser[0] });
        } else {
            return NextResponse.json({ user: usersResult[0] });
        }
    } catch (e) {
        console.error("Error in fetching/creating user:", e);
        return NextResponse.json({ error: "Failed to create a new user" }, { status: 500 });
    }
}
