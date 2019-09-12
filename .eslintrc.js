/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-11 10:23:11
 * @LastEditTime: 2019-09-11 10:23:11
 * @LastEditors: your name
 */
module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
    },
    "parser": "babel-eslint"
};