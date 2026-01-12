module.exports = {
  entry: {
    // 'common': {
    //   import: [
    //     // "./views/style.js",
    //     "./views/style.scss",
    //     // "./views/components.js",
    //     // "./controllers/BaseController.js",
    //   ],
    // },
    'youtube': {
      import: [__dirname + '/controllers/YoutubeController.js'],
    },
    'youtube-mobile': {
      import: [__dirname + '/controllers/YoutubeMobileController.js'],
    },
    'bilibili': {
      import: [__dirname + '/controllers/BiliBiliController.js'],
    },
    'vkvideo': {
      import: [__dirname + '/controllers/vkVideoController.js'],
    },
    'vkvideo-mobile': {
      import: [__dirname + '/controllers/vkVideoMobileController.js'],
    },
    // 'dailymotion': {
    //   import: [__dirname + '/controllers/DailyMotionController.js'],
    // }
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
