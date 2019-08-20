/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 18:02:22
 * @LastEditTime: 2019-08-20 11:52:27
 * @LastEditors: Please set LastEditors
 */

const signalResponse = callback => {
    // 缓存
    if (whiteBoardSignal.session) {
        // 用户登出回调
        whiteBoardSignal.session.onLogout = (reason) => {
            console.log('用户登出！')
            if (callback) callback({
                type: 'onLogout',
                data: { reason }
            });
        }

        // 接收方收到消息时接收方收到的回调
        whiteBoardSignal.session.onMessageInstantReceive = (account, uid, msg) => {
            console.log('接收方收到消息时接收方收到');
            if (callback) callback({
                type: 'onMessageInstantReceive',
                data: { account, uid, msg }
            });
        }
    }

    // 频道
    if (whiteBoardSignal.channel) {
        // 离开频道回调
        whiteBoardSignal.channel.onChannelLeaved = (account, uid) => {
            console.log('离开频道！')
            if (callback) callback({
                type: 'onChannelLeaved',
                data: { account,uid }
            });
        }

        // 收到频道消息回调
        whiteBoardSignal.channel.onMessageChannelReceive = (account, uid, msg) => {
            console.log('收到频道消息回调');
            if (callback) callback({
                type: 'onMessageChannelReceive',
                data: { account, uid, msg }
            });
        }

        // 其他用户离开频道回调
        whiteBoardSignal.channel.onChannelUserLeaved = (account, uid) => {
            console.log('其他用户离开频道');
            if (callback) callback({
                type: 'onChannelUserLeaved',
                data: { account,uid }
            });
        }

        // 其他用户加入频道回调
        whiteBoardSignal.channel.onChannelUserJoined = (account, uid) => {
            console.log('其他用户加入频道');
            if (callback) callback({
                type: 'onChannelUserJoined',
                data: { account, uid }
            });
        }

        // 获取频道内用户列表回调
        whiteBoardSignal.channel.onChannelUserList = (users) => {
            console.log('获取频道内用户列表');
            if (callback) callback({
                type: 'onChannelUserList',
                data: { users }
            });
        }

        // 频道属性发生变化回调
        whiteBoardSignal.channel.onChannelAttrUpdated = (name, value, type) => {
            console.log('频道属性发生变化！')
            if (callback) callback({
                type: 'onChannelAttrUpdated',
                data: { name, value, type }
            });
        }
    }
}

export default signalResponse