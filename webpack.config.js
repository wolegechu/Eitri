const path = require('path');

module.exports = {
  entry: './src/v-dom/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
      },
      {
        test: /\.(xlsx)\??.*$/,
        loader: 'url-loader?name=excels/[hash:8].[name].[ext]'
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader", // 将 CSS 转化成 CommonJS 模块
          "sass-loader" // 将 Sass 编译成 CSS，默认使用 Node Sass
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      'vue': 'vue/dist/vue.js',
    },
    modules: ['node_modules']
  },
  output: { filename: 'bundle.js', path: path.resolve(__dirname, 'dist') }
};