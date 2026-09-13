import React, {useEffect, useState} from 'react';
import {continueRender, delayRender} from 'remotion';

/** Every family referenced by fonts.css, with the weights actually used. */
const FACES = [
  '600 100px "Anek Kannada"',
  '700 100px "Anek Kannada"',
  '800 100px "Anek Kannada"',
  '700 100px "Noto Sans Kannada"',
  '800 100px "Noto Sans Kannada"',
  '900 100px "Noto Sans Kannada"',
  '700 100px "Noto Serif Kannada"',
  '800 100px "Noto Serif Kannada"',
  '900 100px "Noto Serif Kannada"',
  '400 100px "Benne"',
  '400 100px "Hubballi"',
  '400 100px "Anton"',
  '400 100px "Bebas Neue"',
  '400 100px "Archivo Black"',
  '600 100px "Oswald"',
  '700 100px "Oswald"',
];

/**
 * Holds the frame until every webfont is actually downloaded.
 *
 * fitText measures with the canvas 2d API, which silently falls back to a
 * system font if the real one has not loaded yet — producing a fit computed
 * against the wrong metrics, and text that overflows the frame.
 */
export const FontGate: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender('Loading fonts'));

  useEffect(() => {
    Promise.all(FACES.map((f) => document.fonts.load(f, 'ಒಂದು ABC')))
      .then(() => document.fonts.ready)
      .then(() => {
        setReady(true);
        continueRender(handle);
      });
  }, [handle]);

  if (!ready) {
    return null;
  }
  return <>{children}</>;
};
