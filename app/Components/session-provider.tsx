"use client"

import { Button } from "@/components/ui/button";
import { SessionProvider, useSession } from "next-auth/react"
import Link from "next/link";

export function Provider({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}

export function Session() {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <div className='flex gap-4 p-4'>
          <Link href="/create-room">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-all duration-500 cursor-pointer p-4 py-5">
              Start Watching
            </Button >
          </Link>

          <Link href="/create-room/join">
            <Button className="border-2 border-gray-500 hover:scale-105 transition-all duration-500 cursor-pointer p-4 py-5">
              Join Room
            </Button>
          </Link>
        </div>
      ) : (
        <div className='flex gap-4 p-4'>
          <Link href="/signin">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-all duration-500 cursor-pointer p-4 py-5">
              Start Watching
            </Button>
          </Link>

          <Link href="/signin">
            <Button className="border-2 border-gray-500 hover:scale-105 transition-all duration-500 cursor-pointer p-4 py-5">
              Join Room
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}