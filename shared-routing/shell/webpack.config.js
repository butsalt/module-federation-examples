const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 3000,
    historyApiFallback: true,
    hot: false,
    hotOnly: false
  },
  output: {
    publicPath: "http://localhost:3000/"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"]
        }
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      library: { type: "var", name: "shell" },
      filename: "remoteEntry.js",
      remotes: {
        order: "order",
        dashboard: "dashboard",
        profile: 'profile',
      },
      exposes: {
        Shell: "./src/Shell",
        Service: "./src/Service"
      },
      shared: [
        "react",
        "react-dom",
        "@material-ui/core",
        "@material-ui/icons",
        "react-router",
        "react-router-dom",
        // workaround to ensure code is provided before booting app
        './src/Service'
      ]
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ]
};
