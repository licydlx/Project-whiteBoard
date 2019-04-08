
function signalResponse(engine, callback) {
    // 频道
    if (engine.channel) {
        engine.channel.onMessageChannelReceive = (account, uid, msg) => {
            if (callback) {
                msg.account = account;
                callback(msg);
            }
        }
    }
}

export default signalResponse