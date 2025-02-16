"use client";

import { SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import Image from "next/image";
import { useEffect, useState } from "react";

interface SpotifyPlayerProps {
  sdk: SpotifyApi,
  track: Track
}

const SpotifyPlayer = (props: SpotifyPlayerProps) => {
  const [player, setPlayer] = useState<Spotify.Player>();
  const [isPaused, setPaused] = useState<boolean>(false);
  const [isActive, setActive] = useState<boolean>(false);
  const [currentTrack, setTrack] = useState<Spotify.Track | null>(null);
  const [deviceId, setDeviceId] = useState<string>();
  useEffect(() => {
    (async () => {
      const token = await props.sdk.getAccessToken();
      
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = false;
      script.defer = true;
      script.id = "spotify-player";
      script.type = "text/javascript"
      
      document.body.appendChild(script);
      
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player( {
          name: "Web Playback SDK",
          getOAuthToken: cb => { cb(token!.access_token);},
          volume: 0.5,
          enableMediaSession: true
        });

        setPlayer(player);
  
        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(() => device_id);
        });
  
        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });

        player.addListener("player_state_changed", (state) => {
          if (!state) {
            return;
          }
  
          setTrack(state.track_window.current_track);
          setPaused(state.paused);
  
          player.getCurrentState().then((state) => {
            if (!state) {
              setActive(false);
            } else {
              setActive(true);
            }
          });
        });
  
        player.connect();
      };
    })();
  }, [props.sdk]);

  useEffect(() => {
    if (player && deviceId) {
      props.sdk.player.transferPlayback([deviceId], true);
    }
  }, [props.sdk, player, deviceId])

  return (
    <div>
    {isActive && currentTrack ? 
      <div className="container">
        <div className="main-wrapper">
          <img src={currentTrack!.album.images[0].url} className="now-playing__cover" alt="" />
          <div className="now-playing__side">
            <div className="now-playing__name">{currentTrack!.name}</div>
            <div className="now-playing__artist">{currentTrack!.artists[0].name}</div>
              <button className="btn-spotify" onClick={() => { player!.previousTrack() }} >
                  &lt;&lt;
              </button>
              <button className="btn-spotify" onClick={() => { player!.togglePlay() }} >
                  { isPaused ? "PLAY" : "PAUSE" }
              </button>
              <button className="btn-spotify" onClick={() => { player!.nextTrack() }} >
                  &gt;&gt;
              </button>
          </div>
        </div>
      </div>
      :<div>
      Not active
    </div>
    }
    </div>
  );
}

export default SpotifyPlayer;