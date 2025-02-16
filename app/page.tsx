"use client";

import sdk from "@/lib/spotify-sdk/ClientInstance";
import { useSession, signOut, signIn } from "next-auth/react";
import SpotifySearch from "@/components/TrackFinder";
import SpotifyScript from "@/components/SpotifyScript";

export default function Home() {
  const session = useSession();

  if (!session || session.status !== "authenticated") {
    return (
      <div>
        <h1>Spotify Web API Typescript SDK in Next.js</h1>
        <button onClick={() => signIn("spotify")}>Sign in with Spotify</button>
      </div>
    );
  }

  return (
    <div>
      <p>Logged in as {session.data.user?.name}</p>
      <button onClick={() => signOut()}>Sign out</button>
      <SpotifySearch sdk={sdk} />
    </div>
  );
}