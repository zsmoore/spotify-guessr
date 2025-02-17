"use client";
export function loadSpotifyPlayer(): Promise<any> {
  return new Promise<void>((resolve, reject) => {
    const scriptTag = document.getElementById('spotify-player');

    if (!scriptTag) {
      const script = document.createElement('script');

      script.id = 'spotify-player';
      script.type = 'text/javascript';
      script.async = false;
      script.defer = true;
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.onload = () => {
        resolve();
      }
      script.onerror = (error: any) => reject(new Error(`loadScript: ${error.message}`));

      document.body.appendChild(script);
    } else {
      resolve();
    }
  });
}