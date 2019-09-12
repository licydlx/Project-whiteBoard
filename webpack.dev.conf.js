/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-01 14:36:54
 * @LastEditTime: 2019-04-01 14:36:54
 * @LastEditors: your name
 */
/* eslint-disable no-undef */
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf.js');

module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        port: 8800
    }
});