const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(baseConfig, {
    mode: 'production',
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        })
    ]
});
