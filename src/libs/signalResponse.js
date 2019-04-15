
function signalResponse(engine, callback) {
    // 频道
    if (engine.channel) {
        engine.channel.onMessageChannelReceive = (account, uid, msg) => {
            if (callback) {
                callback(msg);
            }
        }
        
        engine.channel.onChannelLeaved = (account,uid) => {
            console.log('onChannelLeaved');
            console.log(account);
            console.log(uid);
        }
        engine.channel.onChannelUserLeaved = (account,uid) => {
            console.log('onChannelUserLeaved');
            console.log(account);
            console.log(uid);
        }
    }

    // 缓存
    if(engine.session){
        engine.session.onLogout = (a) => {
            console.log('onLogout');
            console.log(a);
           // callback(e);
        }
    }
}

export default signalResponse