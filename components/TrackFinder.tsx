"use client";

import { getRandomTrack } from "@/lib/data/data";
import { SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import SpotifyPlayer from "./SpotifyPlayer";

interface TrackFinderProps {
  sdk: SpotifyApi
}


const TrackFinder = (props: TrackFinderProps) => {
  const [randomTrack, setRandomTrack] = useState<Track>();
  useEffect(() => {
    (async () => {
      setRandomTrack(await getRandomTrack(props.sdk));
    })();
  }, [props.sdk]);

  return (
    <div>
      {randomTrack 
      ? <div>
        {randomTrack.name}
        <SpotifyPlayer sdk={props.sdk} track={randomTrack}/>
        </div>
      : <BarLoader loading={true} />}
    </div>
  );
}

export default TrackFinder;