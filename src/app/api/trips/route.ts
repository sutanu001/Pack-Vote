import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/trips - List all trips
export async function GET() {
  try {
    const trips = await db.trip.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        members: { include: { user: true } },
        _count: { select: { destinations: true, votes: true, chatMessages: true } },
      },
    });
    return NextResponse.json({ trips });
  } catch (error) {
    console.error("GET /api/trips error:", error);
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
  }
}

// POST /api/trips - Create a trip
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, startDate, endDate, budget, destinationType, creatorId, inviteCode } = body;

    if (!name || !creatorId) {
      return NextResponse.json({ error: "Name and creatorId are required" }, { status: 400 });
    }

    const trip = await db.trip.create({
      data: {
        name,
        description,
        startDate,
        endDate,
        budget,
        destinationType,
        inviteCode: inviteCode || Math.random().toString(36).substring(2, 8).toUpperCase(),
        creatorId,
        status: "planning",
      },
    });

    return NextResponse.json({ trip }, { status: 201 });
  } catch (error) {
    console.error("POST /api/trips error:", error);
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
  }
}