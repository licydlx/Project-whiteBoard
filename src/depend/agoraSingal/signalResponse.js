
function signalResponse(engine, callback) {
    // 缓存
    if(engine.session){
        // 用户登出回调
        engine.session.onLogout = (reason) => {
            console.log('用户登出！')
        }

        // 接收方收到消息时接收方收到的回调
        engine.session.onMessageInstantReceive = (account,uid,msg) => {
            console.log('接收方收到消息时接收方收到');
            if (callback) callback('onMessageInstantReceive',{account,uid,msg});
        }
    }
    
    // 频道
    if (engine.channel) {
        // 离开频道回调
        engine.channel.onChannelLeaved = (account,uid) => {
            console.log('离开频道！')
        } 

        // 收到频道消息回调
        engine.channel.onMessageChannelReceive = (account, uid, msg) => {
            if (callback) callback('onMessageChannelReceive',msg);
        }
        
        // 其他用户离开频道回调
        engine.channel.onChannelUserLeaved = (account,uid) => {
            console.log('其他用户离开频道');
        }

        // 其他用户加入频道回调
        engine.channel.onChannelUserJoined = (account, uid) =>{
            console.log('其他用户加入频道');
            if (callback) callback('onChannelUserJoined',{account,uid});
        }

        // 获取频道内用户列表回调
        engine.channel.onChannelUserList = (users) =>{
            console.log('获取频道内用户列表');
        }

        // 频道属性发生变化回调
        engine.channel.onChannelAttrUpdated = (name, value, type) => {
            console.log('频道属性发生变化！')
        }
    }
}

export default signalResponse