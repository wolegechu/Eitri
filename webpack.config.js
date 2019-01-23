const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/},
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
      },
    ]
  },
  resolve: {extensions: ['.tsx', '.ts', '.js'], modules: ['node_modules']},
  output: {filename: 'bundle.js', path: path.resolve(__dirname, 'dist')}
};