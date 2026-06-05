"use server";

import { db } from "@/db/drizzle";
import { rooms } from "@/db/schema";


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

  return { success: true };
}
