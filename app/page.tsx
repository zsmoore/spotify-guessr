"use client";

import sdk from "@/lib/spotify-sdk/ClientInstance";
import { useSession, signIn } from "next-auth/react";
import SpotifySearch from "@/components/TrackFinder";

export default function Home() {
  const session = useSession();

  if (!session || session.status !== "authenticated") {
    return (
      <div className="items-center justify-items-center min-h-screen flex flex-col pe-8 ps-8 gap-2">
        <h1>Spotify Guesser</h1>
        <button className="border rounded p-1 bg-[color:--foreground] text-[color:--background]" onClick={() => signIn("spotify")}>Sign in with Spotify</button>
      </div>
    );
  }

  return (
      <div className="items-center justify-items-center flex min-h-screen pe-8 ps-8">
        <SpotifySearch sdk={sdk} />
      </div>
  );
}