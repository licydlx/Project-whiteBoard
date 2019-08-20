/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-20 13:46:40
 * @LastEditTime: 2019-08-20 18:06:17
 * @LastEditors: Please set LastEditors
 */
import { put } from 'redux-saga/effects';
import * as AllActions from '../../actions/index';

function signalAction(msg) {
    put({      // dispatch一个action到reducer， payload是请求返回的数据
        type: msg.action.type,
        name: msg.action.name
    });
}


// signal 回调监听
function signalCallback(e) {
    console.log("signal 回调监听")
    console.log(e);
    if (e && e.datat && e.data.msg) {
        // signalAction(JSON.parse(e.data.msg))
        let msg = JSON.parse(e.data.msg);

        // yield put({      // dispatch一个action到reducer， payload是请求返回的数据
        //     type: msg.action.type,
        //     name: msg.action.name
        // });
    }

    // console.log(AllActions)
}

export default signalCallback
