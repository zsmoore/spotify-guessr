"use client";

import { loadSpotifyPlayer } from "@/lib/spotify-sdk/util";
import { SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { useEffect, useLayoutEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import Game from "./Game";

interface SpotifyPlayerProps {
  sdk: SpotifyApi,
  token: string,
  track: Track
  allTrackNames: string[]
}

const SpotifyPlayer = (props: SpotifyPlayerProps) => {

  const [player, setPlayer] = useState<Spotify.Player>();
  const [isActive, setActive] = useState<boolean>(false);
  const [currentTrack, setTrack] = useState<Spotify.Track | null>(null);
  const [songSet, setSongSet] = useState(false);
  const [itemQueued, setItemQueued] = useState(false);
  const [skipAttempts, setSkipAttempts] = useState(0);
  const [rateLimit, setRateLimit] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const initializePlayer = () => {
    const player = new window.Spotify.Player( {
      name: "Web Playback SDK",
      getOAuthToken: cb => { cb(props.token);},
      volume: 0.5
    });

    player.addListener('ready', ({ device_id }) => {
      props.sdk.player.transferPlayback([device_id]);
      setPlayer(() => player);
    });
  
    player.addListener("player_state_changed", (state) => {
      if (!state) {
        return;
      }

      setTrack(() => state.track_window.current_track);

      player.getCurrentState().then((state) => {
        if (!state) {
          setActive(() => false);
        } else if (state && !isActive){
          setActive(() => true);
        }
      });
    });
    player.connect();
  }

  window.onSpotifyWebPlaybackSDKReady = initializePlayer;
  
  useEffect(() => {
    (async () => {
      await loadSpotifyPlayer();
      window.onSpotifyWebPlaybackSDKReady = () => {
        initializePlayer();
      }
    })();
  }, [props.sdk]);

  useEffect(() => {
    (async () => {
      if (!itemQueued && player && isActive) {
        try {
        await props.sdk.player.addItemToPlaybackQueue(props.track.uri);
        } catch (e) {
          console.log(e);
        }
        setItemQueued(() => true);
      }
    })();
  }, [player, isActive, props.sdk, props.track, itemQueued])

  useEffect(() => {
    (async () => {
      if (itemQueued) {
        const queue = await props.sdk.player.getUsersQueue();
        for (let i = 0; i < queue.queue.length; i++) {
          const item = queue.queue[i];
          if (item.id === props.track.id) {
            setSongSet(() => true);
            return;
          }
        }
        setItemQueued(() => true);
      }
    })();
  }, [itemQueued, props.sdk.player, props.track.id]);

  useLayoutEffect(() => {
    if (rateLimit) {
      return;
    }

    if (songSet && currentTrack && currentTrack.id !== props.track.id) {
      player?.nextTrack();
      setSkipAttempts((s) => s + 1);
    } else if (currentTrack && currentTrack.id === props.track.id) {
      setLoaded(() => true);
    }
  }, [currentTrack, props.track, songSet, player, rateLimit]);

  useEffect(() => {
    if (skipAttempts > 10) {
      setRateLimit(() => true);
    }
  }, [skipAttempts]);

  return (
    <div>
      {rateLimit ? <div>Rate limited try again</div>
      : loaded && player
        ? <Game sdk={props.sdk} player={player} targetTrack={props.track} options={props.allTrackNames}/>
        : <BarLoader loading={true} /> }
    </div>
  );
}

export default SpotifyPlayer;