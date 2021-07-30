const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
    entry: [
        path.resolve(__dirname, 'src', 'index.js'),
        path.resolve(__dirname, 'src', 'index.scss'),
        path.resolve(__dirname, 'src', 'companies.js'),
        path.resolve(__dirname, 'src', 'companies.scss'),
    ],
    output: {
        path: path.join(__dirname, 'dist'), 
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/, 
                exclude: /node_modules/, 
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ['@babel/plugin-syntax-top-level-await']
                    }
                }, 
            },
            {
                test: /\.s?[ac]ss$/, 
                use: [
                    MiniCssExtractPlugin.loader, 
                    {
                        loader: 'css-loader', 
                        options: { url: false } 
                    },
                    'sass-loader', 
                ]
            }
        ],
    },
    plugins: [new MiniCssExtractPlugin()],
};

module.exports = (env, argv) => {
    if (argv.mode === 'production') {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval-source-map';
    }
    return config;
}