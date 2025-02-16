"use client";

import { Track } from "@spotify/web-api-ts-sdk";

const TRACK_KEY = "spotify-guessr-tracks";

export const getLocalTracks = (): string[] | undefined => {
  const value = localStorage.getItem(TRACK_KEY);
  if (value) {
    return JSON.parse(value);
  }
  return undefined;
}

export const storeTracks = (tracks: Track[]) => {
  localStorage.setItem(TRACK_KEY, JSON.stringify(tracks.map(track => track.id)));
}