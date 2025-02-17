"use client";

import sdk from "@/lib/spotify-sdk/ClientInstance";
import { useSession, signOut, signIn } from "next-auth/react";
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
    <div className="m-auto">
      <header>
        <nav className="mx-auto flex max-w-7xl items-center justify-between ps-6 pb-2 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
          <button className="outline rounded p-1 bg-[color:--foreground] text-[color:--background]" onClick={() => signOut()}>Sign out</button>
          </div>
        </nav>
      </header>
      <div className="items-center justify-items-center min-h-screen flex flex-col pe-8 ps-8">
        <div className="m-auto">
          <SpotifySearch sdk={sdk} />
        </div>
      </div>
    </div>
  );
}