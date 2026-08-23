import {existsSync} from 'node:fs';
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// Some sandboxes (e.g. this repo's default dev container) have no network
// egress to remotion.media, so fall back to the Chromium already
// preinstalled for Playwright instead of letting Remotion try to download
// its own. On a machine where Remotion can fetch its own browser, this is
// a no-op.
const sandboxChrome =
	'/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (existsSync(sandboxChrome)) {
	Config.setBrowserExecutable(sandboxChrome);
}

