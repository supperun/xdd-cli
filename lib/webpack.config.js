const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index.js",
  },
  stats: {
    // 控制台输出日志控制
    assets: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
  },
  resolve: {
    extensions: [".ts"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ico)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "assts/",
            },
          },
        ],
        include: path.resolve(__dirname, "./public/assts"),
      },
      {
        test: /\.(ogg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "assts/",
            },
          },
        ],
        include: path.resolve(__dirname, "./public/assts"),
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        include: path.resolve(__dirname, "./public"),
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        include: path.resolve(__dirname, "./src"),
        exclude: path.resolve(__dirname, "./node_modules"),
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    hot: true,
    port: 1988,
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
