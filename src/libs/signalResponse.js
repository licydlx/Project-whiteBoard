
function signalResponse(engine){

    // 频道
    if(engine.channel){
        engine.channel.onMessageChannelReceive = (account, uid, msg) => {
            console.log(account);
            console.log(uid);
            console.log(msg);
            return {
                account:account,
                uid:uid,
                msg:msg
            }
        }
    }



    return {
        onMessageChannelReceive:engine.channel.onMessageChannelReceive
    }
}




export default signalResponse