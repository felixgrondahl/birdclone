const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: 'file-loader',
                include: [path.resolve(__dirname, 'src')]
            },
            // {
            //     test: /\.json$/,
            //     use: 'json-loader',
            //     include: [path.resolve(__dirname, 'src')]
            // }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', 'json']
    },
    plugins: [
        new CopyPlugin({
          patterns: [
            { from: './src/assets', to: 'assets' },
          ],
        }),
      ],
    output: {
        publicPath: 'dist',
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};