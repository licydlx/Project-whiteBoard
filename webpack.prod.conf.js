/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-01 14:36:53
 * @LastEditTime: 2019-04-01 14:36:53
 * @LastEditors: your name
 */
/* eslint-disable no-undef */
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
