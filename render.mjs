import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {getCompositions} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const OUT = path.resolve('out');
// Reuse the container's Chromium instead of letting Remotion download one.
const BROWSER =
  '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

fs.mkdirSync(OUT, {recursive: true});

console.log('Bundling...');
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});

const args = process.argv.slice(2);
const ids = args.length
  ? args
  : (await getCompositions(serveUrl, {browserExecutable: BROWSER})).map((c) => c.id);

for (const id of ids) {
  const composition = await selectComposition({
    serveUrl,
    id,
    inputProps: {},
    browserExecutable: BROWSER,
  });
  const output = path.join(OUT, `${id}.png`);
  await renderStill({
    composition,
    serveUrl,
    output,
    // PNG keeps the alpha channel, which is what makes these drop straight
    // onto footage in CapCut.
    imageFormat: 'png',
    browserExecutable: BROWSER,
    chromiumOptions: {gl: 'swangle'},
    overwrite: true,
  });
  console.log(`OK ${output}`);
}

console.log('Done.');
