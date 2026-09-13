import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('png');
Config.overrideWebpackConfig((config) => ({
  ...config,
  module: {
    ...config.module,
    rules: [
      ...(config.module?.rules ?? []),
      {test: /\.ttf$/, type: 'asset/resource'},
    ],
  },
}));
