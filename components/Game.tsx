"use client";

import { SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import EndGame from "./EndGame";
import { getExpectedTrackName } from "@/lib/util/util";

interface GameProps {
  sdk: SpotifyApi,
  player: Spotify.Player,
  targetTrack: Track
  options: string[]
}

const Game = (props: GameProps) => {
  const [currentSelected, setCurrentSelected] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);
  const [attemptNumber, setAttemptNumber] = useState(0);
  const [timeToGo, setTimeToGo] = useState(1);
  let timeoutId: NodeJS.Timeout | undefined = undefined;
  let intervalId = undefined;
  const durations = new Map([
    [0, 1],
    [1, 3],
    [2, 5],
    [3, 15],
    [4, 30]
  ]);

  function testInput() {
    if (currentSelected?.trim() == getExpectedTrackName(props.targetTrack).trim()) {
      setSuccess(() => true);
      setGameEnd(() => true);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    } else {
      if (attemptNumber + 1 > 4) {
        setGameEnd(() => true);
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
        return;
      }
      setAttemptNumber((num) => num + 1);
      setTimeToGo(() => durations.get(attemptNumber + 1)!);
    }
  }

  async function maybeTogglePlay () {
    if (!gameEnd) {
      await props.player.togglePlay()
      await props.player.seek(0);
      clearInterval(intervalId);
      setTimeToGo(() => 0);
    }
  }

  async function attempt() {
    await props.player.togglePlay();
    setTimeToGo(() => durations.get(attemptNumber)!);
    intervalId = setInterval(() => {
      setTimeToGo((n) => n - 1);
    }, 1000)
    timeoutId = setTimeout(async () => {
      await maybeTogglePlay();
    }, durations.get(attemptNumber)! * 1000);
  }

  return (
    <div>
      {gameEnd
      ? <EndGame player={props.player} track={props.targetTrack} didWin={success} />
      :
      <div className="grid grid-cols-2 gap-4">
        <h3>Attempt # {attemptNumber + 1}</h3>
        <h3 className="text-end">{timeToGo}</h3>
        <button className="outline rounded"onClick={attempt}>Listen</button>
        <button onClick={testInput} className="outline rounded p-1 bg-[color:--foreground] text-[color:--background]">Submit</button>
        <Typeahead
          onChange={(selected) => {
            if (selected.length > 0) {
              setCurrentSelected(() => selected[0] as string)
            }
          }}
          options={props.options}
          id="game-input"
          className="col-span-2"
        />
      </div>
      }
    </div>
  );
};

export default Game;