
function signalResponse(engine, callback) {
    // 频道
    if (engine.channel) {
        engine.channel.onMessageChannelReceive = (account, uid, msg) => {
            console.log('web接受广播信息！');
            console.log(account);
            console.log(msg);
            if (callback) {
                callback(msg);
            }
        }
    }
}

export default signalResponse