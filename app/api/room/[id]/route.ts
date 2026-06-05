import { db } from "@/db/drizzle";
import { rooms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // The room id in the URL is the access hash (lowercased, no dashes)
  // We need to find the room where the access hash matches
  const allRooms = await db.select().from(rooms);

  // Match by normalizing: strip dashes and lowercase both sides
  const normalizedId = id.toLowerCase().replace(/-/g, "");
  const room = allRooms.find(
    (r) => r.accessHash.toLowerCase().replace(/-/g, "") === normalizedId
  );

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: room.id,
    destName: room.destName,
    accessHash: room.accessHash,
    visibility: room.visibility,
    participantLimit: room.participantLimit,
    videoUrl: room.videoUrl,
    creatorId: room.creatorId,
  });
}
