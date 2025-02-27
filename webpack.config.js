const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const path = require('path')

module.exports = {
    entry: './public/js/script.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, // Extracts CSS into a separate file
                    'css-loader', // Resolves CSS imports
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'bundle.css', // The name of the generated CSS file
        }),
    ],
    optimization: {
        minimize: true, // Enables minimization for both JS and CSS
        minimizer: [
            '...', // Includes Webpack's default JS minimizer (TerserPlugin)
            new CssMinimizerPlugin(), // Minifies CSS
        ],
    },
    mode: 'production', // Use production mode for optimization
    performance: {
        maxAssetSize: 500000, // Allow up to 500 KB per asset
        maxEntrypointSize: 500000, // Allow up to 500 KB for the entry point
        hints: 'warning', // Show warnings for performance issues
    },
}