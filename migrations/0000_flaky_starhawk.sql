CREATE TABLE "rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"Destination" text NOT NULL,
	"Access Hash" text NOT NULL,
	"visibility" text DEFAULT 'private' NOT NULL,
	"Participant Limit" integer DEFAULT 10 NOT NULL,
	"Creator ID" text NOT NULL,
	CONSTRAINT "rooms_id_unique" UNIQUE("id")
);
