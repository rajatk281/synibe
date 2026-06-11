import { AccessToken } from "livekit-server-sdk";

export async function POST(req: Request) {
  const { roomName, participantName } = await req.json();

  if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    return Response.json(
      { error: "LiveKit API credentials not configured" },
      { status: 500 }
    );
  }

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantName,
      ttl: "10m",
    }
  );

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return Response.json({
    token: await at.toJwt(),
  });
}