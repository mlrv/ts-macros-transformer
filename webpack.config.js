const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
				options: {
					compiler: "ttypescript"
				}
      },
    ],
  },
  entry: "./examples/main.ts",
  mode: "production",
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
  },
};
