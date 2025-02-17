import { Track } from "@spotify/web-api-ts-sdk";

export const shuffle = <T>(arr: T[]): T[] => {
  let currentIndex = arr.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex], arr[currentIndex]];
  }
  return arr;
}

export const getExpectedTrackName = (track: Track): string => {
 return track.name + "-" + track.artists.map(artist => artist.name).join(", ");
}