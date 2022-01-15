const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        client: './src/js/client.js',
        admin: './src/js/admin.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].min.js',
    },
    target: "web", 
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['client'],
        }),
        new HtmlWebpackPlugin({
            template: './src/admin.html',
            filename: 'admin.html',
            chunks: ['admin'],
        })
    ]
}
// eksportuję ustawienia dla webpack-a
