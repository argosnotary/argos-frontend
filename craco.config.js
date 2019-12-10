module.exports = {
  webpack: {
    alias: {},
    plugins: [],
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.module.rules.push({
        test: /\.ts$|\.tsx$/,
        enforce: "pre",
        use: [
          {
            loader: "tslint-loader",
            options: {
              emitErrors: true
            }
          }
        ]
      });

      return webpackConfig;
    }
  }
};
