"use client";

import { getAllTrackNamesRandomized, getRandomTrack } from "@/lib/data/data";
import { SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import SpotifyPlayer from "./SpotifyPlayer";

interface TrackFinderProps {
  sdk: SpotifyApi
}

const TrackFinder = (props: TrackFinderProps) => {
  const [randomTrack, setRandomTrack] = useState<Track>();
  const [token, setToken] = useState<string>();
  useEffect(() => {
    (async () => {
      setRandomTrack(await getRandomTrack(props.sdk));
      const tok = await props.sdk.getAccessToken();
      setToken(() => tok?.access_token);
    })();
  }, [props.sdk]);

  return (
    <div>
      {randomTrack && token
      ? <div>
        <SpotifyPlayer sdk={props.sdk} track={randomTrack} token={token} allTrackNames={getAllTrackNamesRandomized()}/>
        </div>
      : <BarLoader loading={true} />}
    </div>
  );
}

export default TrackFinder;