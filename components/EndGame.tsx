"use client";

import { Track } from "@spotify/web-api-ts-sdk";
import Image from "next/image";

interface EndGameProps {
  track: Track
  player: Spotify.Player
  didWin: boolean
}

const EndGame = (props: EndGameProps) => {
  const playSong = async () => {
    await props.player.seek(0);
    await props.player.resume();
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <Image src={props.track.album.images[0].url} className="flex-start" alt="" height={500} width={500}/>
      </div>
      <div className="content-center">
          <h2 className="font-[family-name:var(--font-geist-mono)]">Artist: {props.track.name}</h2>
          <h3 className="font-[family-name:var(--font-geist-mono)]">Song: {props.track.artists[0].name}</h3>
      </div>
      <button className="outline rounded p-1 bg-[color:--foreground] text-[color:--background]" onClick={playSong}>Play full song</button>
      <button className="outline rounded p-1 bg-[color:--foreground] text-[color:--background]" onClick={() => window.location.reload()}>Try Again?</button>
    </div>
  );
}

export default EndGame;