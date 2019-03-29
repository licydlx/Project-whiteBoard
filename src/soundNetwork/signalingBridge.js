var signal = Signal('b73cb3455de34ae8bbc97471eaadd65c');
var account = Math.floor(Math.random() * 100);
var session = signal.login(account, '_no_need_token');
var channel;
setTimeout(function () {
    channel = session.channelJoin(1);

    //channel.onMessageChannelReceive(account, 0, msg);
    console.log(account);
    console.log(channel);
}, 1000);


function sendMessage(){
    console.log('sendMessage');
    channel.messageChannelSend(account,function(e){
        console.log(e);
        console.log('sendMessage成功');
    });
    console.log(channel);
}