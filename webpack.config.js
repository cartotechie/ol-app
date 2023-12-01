const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  entry: {
    // Specify the key-value pair for your entry point
    map: "./src/map.js",
  },
  output: {
    path: path.resolve(__dirname, "./static/worldbank/js"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  devServer: {
    static: path.join(__dirname, './static/worldbank/js'),
    port: 3000,
    
  },
};
