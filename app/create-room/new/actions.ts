"use server";

import { db } from "@/db/drizzle";
import { rooms } from "@/db/schema";
import { redis } from "@/lib/redis";

export async function createRoom(data: {
  destName: string;
  accessHash: string;
  visibility: "public" | "private";
  participantLimit: number;
  creatorId: string;
  videoUrl: string;
}) {
  await db.insert(rooms).values({
    destName: data.destName,
    accessHash: data.accessHash,
    visibility: data.visibility,
    participantLimit: data.participantLimit,
    creatorId: data.creatorId,
    videoUrl: data.videoUrl,
  });

  // ── Pre-populate Redis cache so the first join is instant ──
  const normalizedHash = data.accessHash.toLowerCase().replace(/-/g, "");
  const cacheKey = `room:hash:${normalizedHash}`;

  try {
    // We don't have the DB-generated UUID here, but caching the data we know
    // ensures the room lookup won't hit the DB on first join.
    // The full payload (with id) will be cached on the first GET request.
    const payload = {
      destName: data.destName,
      accessHash: data.accessHash,
      visibility: data.visibility,
      participantLimit: data.participantLimit,
      videoUrl: data.videoUrl,
    };
    await redis.set(cacheKey, JSON.stringify(payload), { EX: 300 });
  } catch {
    // Redis unavailable — no-op, first GET will cache it
  }

  return { success: true };
}
