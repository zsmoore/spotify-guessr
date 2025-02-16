"use client";

import { Page, SavedTrack, SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { getLocalTracks, storeTracks } from "../util/storage";

const getAllSavedSongs = async (sdk: SpotifyApi): Promise<Track[]> => {
  const allResults: Track[] = [];
  let result: Page<SavedTrack> = await sdk.currentUser.tracks.savedTracks(50, undefined, undefined);
  while(result.next) {
    allResults.push(...result.items.map(item => item.track));
    result = await sdk.currentUser.tracks.savedTracks(50, result.offset + result.items.length, undefined);
  }
  allResults.push(...result.items.map(item => item.track));
  return allResults;
}

const getAndStoreSongs = async (sdk: SpotifyApi) => {
  const results = await getAllSavedSongs(sdk);
  storeTracks(results);
}

export const getRandomTrack = async (sdk: SpotifyApi): Promise<Track> => {
  let storedTracks = getLocalTracks();
  if (storedTracks) {
    const randomId = storedTracks[Math.floor(Math.random() * storedTracks.length)]
    return await getTrack(sdk, randomId);
  }

  await getAndStoreSongs(sdk);

  // try again - we pull from storage only
  storedTracks = getLocalTracks();
  if (storedTracks) {
    const randomId = storedTracks[Math.floor(Math.random() * storedTracks.length)]
    return await getTrack(sdk, randomId);
  }

  throw new Error("Cannot find songs");
}

const getTrack = async (sdk: SpotifyApi, id: string): Promise<Track> => {
  return await sdk.tracks.get(id);
}