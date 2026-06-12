import { db } from "@/db/drizzle";
import { rooms } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const normalizedId = id.toLowerCase().replace(/-/g, "");

  // ── Check Redis cache first ──
  const cacheKey = `room:hash:${normalizedId}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }
  } catch {
    // Redis unavailable — fall through to DB
  }

  // ── Query DB (optimized: no more full-table scan) ──
  const allRooms = await db
    .select()
    .from(rooms)
    .where(
      eq(
        sql`LOWER(REPLACE(${rooms.accessHash}, '-', ''))`,
        normalizedId
      )
    )
    .limit(1);

  const room = allRooms[0];

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const payload = {
    id: room.id,
    destName: room.destName,
    accessHash: room.accessHash,
    visibility: room.visibility,
    participantLimit: room.participantLimit,
    videoUrl: room.videoUrl,
  };

  // ── Cache in Redis (5 min TTL) ──
  try {
    await redis.set(cacheKey, JSON.stringify(payload), { EX: 300 });
  } catch {
    // Redis unavailable — no-op
  }

  return NextResponse.json(payload);
}
