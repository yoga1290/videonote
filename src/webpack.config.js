const { optimize } = require("webpack");

module.exports = {
  context: __dirname,
  entry: {
    'base-bundle': [ './controllers/BaseController.js' ],
    'youtube': {
      dependOn: 'base-bundle',
      import: ['./controllers/YoutubeController.js'],
    },
    'youtube-mobile': {
      dependOn: 'base-bundle',
      import: ['./controllers/YoutubeMobileController.js'],
    },
    'bilibili': {
      dependOn: 'base-bundle',
      import: ['./controllers/BiliBiliController.js'],
    },
    'vkvideo': {
      dependOn: 'base-bundle',
      import: ['./controllers/vkVideoController.js'],
    },
    'vkvideo-mobile': {
      dependOn: 'base-bundle',
      import: ['./controllers/vkVideoMobileController.js'],
    },
  },

  optimization: {
    chunkIds: 'size',
    moduleIds: 'size',
    concatenateModules: true,
    innerGraph: true,
    minimize: true,
    usedExports: true,
  },

  output: {
    filename: '[name].js',
    path: __dirname + '/../dist'
  },

  module: {
    rules: [{
      test: /\.(ts|js)x?$/,
      loader: 'babel-loader',
      // exclude: /node_modules/,
      exclude: /node_modules\/(?!yoga1290-ui-pool)/,
      options: {
        babelrc: false,
        "presets": [
          "@babel/env",
        ],
        "plugins": [
            "@babel/plugin-transform-class-properties",
            "@babel/plugin-transform-object-rest-spread"
        ]
      }
    }, {
      test: /\.scss$/,
      use: [
        "style-loader", // creates style nodes from JS strings
        "css-loader", // translates CSS into CommonJS
        "sass-loader" // compiles Sass to CSS, using Node Sass by default
      ]
    }]
  },

};
