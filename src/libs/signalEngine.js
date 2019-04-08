import GLB from '../configs/GLB';

export default function (data, callback) {
    if (!Signal) {
        console.log('声网信令SDK缺失！');
        return;
    }

    if (data) {
        if (data.account) GLB.account = data.account;
        if (data.token) GLB.token = data.token;
        if (data.roomID) GLB.roomID = data.roomID;
    }

    const signal = Signal(GLB.appId);
    let session, channel;

    // 登录
    session = signal.login(GLB.account, GLB.token);
    session.onLoginSuccess = (uid) => {
        // 加入频道
        channel = session.channelJoin(GLB.roomID);
        channel.onChannelJoined = () => {
            let engine = {
                signal: signal,
                session: session,
                channel: channel
            };

            if (callback) {
                callback(engine)
            }
        }
    }
}