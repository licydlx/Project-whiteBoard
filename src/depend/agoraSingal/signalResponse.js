
function signalResponse(engine, callback) {
    

    // 频道
    if (engine.channel) {
        engine.channel.onMessageChannelReceive = (account, uid, msg) => {
            if (callback) callback('onMessageChannelReceive',msg);
        }
        
        engine.channel.onChannelLeaved = (account,uid) => {
            console.log('onChannelLeaved');
            // console.log(account);
            // console.log(uid);
        }

        engine.channel.onChannelUserLeaved = (account,uid) => {
            console.log('onChannelUserLeaved');
            // console.log(account);
            // console.log(uid);
        }

        engine.channel.onChannelUserJoined = (account, uid) =>{
            console.log('onChannelUserJoined');
            if (callback) callback('onChannelUserJoined',{account,uid});
        }

        engine.channel.onChannelUserList = (users) =>{
            console.log('onChannelUserList');
            console.log(users);
        }
    }

    // 缓存
    if(engine.session){
        engine.session.onLogout = (a) => {
            console.log('onLogout');
            // console.log(a);
            // callback(e);
        }

        engine.session.onMessageInstantReceive = (account,uid,msg) => {
            console.log('onMessageInstantReceive');
            if (callback) callback('onMessageInstantReceive',{account,uid,msg});
        }
    }
}

export default signalResponse