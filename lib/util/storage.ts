"use client";

import { Track } from "@spotify/web-api-ts-sdk";
import { getExpectedTrackName } from "./util";

const TRACK_KEY = "spotify-guessr-tracks";
const TRACK_NAMES = "spotify-guessr-track-names";

export const getLocalTracks = (): string[] | undefined => {
  const value = localStorage.getItem(TRACK_KEY);
  if (value) {
    return JSON.parse(value);
  }
  return undefined;
}

export const getLocalTrackNames = (): string[] | undefined => {
  const value = localStorage.getItem(TRACK_NAMES);
  if (value) {
    return JSON.parse(value);
  }
  return undefined;
}

export const storeTracks = (tracks: Track[]) => {
  localStorage.setItem(TRACK_KEY, JSON.stringify(tracks.map(track => track.id)));
  localStorage.setItem(TRACK_NAMES, JSON.stringify(tracks.map(track => getExpectedTrackName(track))));
}