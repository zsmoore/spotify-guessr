"use client";

import { getAllTrackNamesRandomized, getRandomTrack } from "@/lib/data/data";
import { SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BarLoader } from "react-spinners";
import SpotifyPlayer from "./SpotifyPlayer";

interface TrackFinderProps {
  sdk: SpotifyApi
}

const TrackFinder = (props: TrackFinderProps) => {
  const [randomTrack, setRandomTrack] = useState<Track>();
  const [token, setToken] = useState<string>();
  const [color, setColor] = useState<string>();
  useLayoutEffect(() => {
    setColor(() => window.getComputedStyle(document.body).getPropertyValue("--foreground"));
  }, [])
  useEffect(() => {
    (async () => {
      setRandomTrack(await getRandomTrack(props.sdk));
      const tok = await props.sdk.getAccessToken();
      setToken(() => tok?.access_token);
    })();
  }, [props.sdk]);

  return (
    <>
      {randomTrack && token
      ? <>
          <SpotifyPlayer sdk={props.sdk} track={randomTrack} token={token} allTrackNames={getAllTrackNamesRandomized()}/>
        </>
      : <div className="grid grid-col-3 gap-4 m-auto">
          <p className="col-span-3">Bootstrapping songs</p>
          <BarLoader className="ms-6" loading={true} color={color} />
        </div>
        }
    </>
  );
}

export default TrackFinder;