"use client";

import { SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { useRef, useState } from "react";
import EndGame from "./EndGame";
import { getExpectedTrackName } from "@/lib/util/util";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";

interface GameProps {
  sdk: SpotifyApi,
  player: Spotify.Player,
  targetTrack: Track
  options: string[]
}

interface OptionObj {
  id: number,
  name: string
}

const getOptions = (arr: string[]): OptionObj[] => {
  const allOptions = [];
  for (let i = 0; i < arr.length; i++) {
    allOptions.push({
      id: i,
      name: arr[i]
    })
  }
  return allOptions;
} 

const Game = (props: GameProps) => {
  const allOptions = useRef(getOptions(props.options));
  
  const [currentSelected, setCurrentSelected] = useState<OptionObj | null>(allOptions.current[0]);
  const [query, setQuery] = useState('')
  const [success, setSuccess] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);
  const [attemptNumber, setAttemptNumber] = useState(0);
  const [timeToGo, setTimeToGo] = useState(1);
  const isPlaying = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeoutId: any | undefined = useRef(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const intervalId: any | undefined = useRef(undefined);
  const durations = new Map([
    [0, 1],
    [1, 3],
    [2, 5],
    [3, 15],
    [4, 30]
  ]);

  async function testInput() {
    if (currentSelected?.name.trim() == getExpectedTrackName(props.targetTrack).trim()) {
      setSuccess(() => true);
      setGameEnd(() => true);
      if (timeoutId) {
        window.clearTimeout(timeoutId.current);
      }
    } else {
      if (attemptNumber + 1 > 4) {
        setGameEnd(() => true);
        if (timeoutId) {
          window.clearTimeout(timeoutId.current);
        }
        return;
      }
      setAttemptNumber((num) => num + 1);
      await maybeTogglePlay(durations.get(attemptNumber + 1)!);
    }
  }

  async function maybeTogglePlay (timeToSet: number) {
    if (!gameEnd && isPlaying.current) {
      await props.player.togglePlay()
      await props.player.seek(0);
      isPlaying.current = false;
    }
    clearInterval(intervalId.current);
    clearTimeout(timeoutId.current);
    setTimeToGo(() => timeToSet);
  }

  async function attempt() {
    await props.player.togglePlay();
    isPlaying.current = true;
    setTimeToGo(() => durations.get(attemptNumber)!);
    intervalId.current = setInterval(() => {
      setTimeToGo((n) => n - 1);
    }, 1000)
    timeoutId.current = setTimeout(async () => {
      await maybeTogglePlay(0);
    }, durations.get(attemptNumber)! * 1000);
  }

  const filteredOptions =
    query === ''
      ? allOptions.current.slice(0, 5)
      : allOptions.current.filter((option) => {
          return option.name.toLowerCase().includes(query.toLowerCase())
        }).slice(0, 5);

  return (
    <>
      {gameEnd
      ? <EndGame player={props.player} track={props.targetTrack} didWin={success} />
      :
      <div className="grid grid-cols-2 gap-4 items-stretch grow">
        <h3>Attempt # {attemptNumber + 1}</h3>
        <h3 className="text-end">{timeToGo}</h3>
        <button className="outline rounded"onClick={attempt}>Listen</button>
        <button onClick={testInput} className="outline rounded p-1 bg-[color:--foreground] text-[color:--background]">Submit</button>
        <Combobox value={currentSelected} onChange={setCurrentSelected} onClose={() => setQuery('')}>
          <ComboboxInput
           className="ps-1"
           displayValue={(option) => (option as OptionObj)?.name}
           onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxOptions className="grid gap-4">
            {filteredOptions.map(option => (
              <ComboboxOption className="p-2 outline outline-width-1" key={option.id} value={option}>
                {option.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      </div>
      }
    </>
  );
};

export default Game;