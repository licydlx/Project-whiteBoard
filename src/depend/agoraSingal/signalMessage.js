/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-21 11:01:55
 * @LastEditTime: 2019-09-03 19:26:39
 * @LastEditors: Please set LastEditors
 */
import SignalData from './SignalData';

function signalMessage() {
    return (next) => (action) => {
        console.log('will dispatch', action)
        // 回放为真时 画板逻辑
        if (SignalData.playback) {
            switch (action.type) {
                // 课件通信，声网信令传输 
                case "CHILD_MESSAGE_BOX":
                    whiteBoardMessage.sendMessage("child", JSON.stringify({ type: action.data.type, handleData: action.data.handleData }));
                    break;
            }
        }

        // 不是回放 才存储
        if (!SignalData.playback) {
            // localStorage 存储 actions
            switch (action.type) {
                case "BOARD_SHOW_TOOLBAR":              // 老师显示画板工具栏
                case "SWITCHBOX_SHOW_SWITCHBAR":        // 老师显示切换工具栏 
                case "SWITCHBOX_SET_TOTAL_PAGE":        // 设置课件总页数 
                    break;
                case "COURSEWARE_SWITCH_TYPE":
                    if (Object.is(action.name, "html5") && action.link && !SignalData.coursewareLoaded) actionDataSave(action);
                    break;
                default:
                    actionDataSave(action);
                    break;
            }
        }

        // 条件：1.白板信令 2.是否广播 3.是否是回放 
        // action
        if (window.whiteBoardSignal && SignalData.broadcast && !SignalData.playback) {
            switch (action.type) {
                case "SWITCHBOX_SET_TOTAL_PAGE":
                case "SWITCHBOX_SHOW_SWITCHBAR":
                case "SWITCHBOX_FULL_SCREEN":
                case "BOARD_SHOW_TOOLBAR":
                case "BOARD_REDUCE_TOOLBAR":
                    break;
                default:
                    window.whiteBoardSignal.channel.messageChannelSend(JSON.stringify({
                        action
                    }));
                    break;
            }
        } else {
            // 重置 actions 状态
            SignalData.broadcast = true;
            SignalData.playback = false;
        }

        // 调用 middleware 链中下一个 middleware 的 dispatch。
        let returnValue = next(action)
        return returnValue
    }
}

const actionDataSave = (action) => {
    ACTIONS_database.setItem(JSON.stringify(+new Date()), action).then(value => {
        switch (action.type) {
            case "BOARD_SWITCH_TOOLBAR":
            case "BOARD_CHANGE_PENSIZE":
            case "BOARD_CHANGE_PENCOLOR":
            case "BOARD_CHANGE_TEXTSIZE":
            case "BOARD_CHANGE_PENSHAPE":
            // case "BOARD_REDUCE_TOOLBAR":

            case "BOARD_ADD_PATH":
            case "BOARD_ADD_TEXT":
            case "BOARD_ADD_GRAPH":
            case "BOARD_REMOVE_CREATED":
                BOARD_database.setItem(JSON.stringify(+new Date()), Object.assign({}, action, { account: SignalData.account, curPage: coursewareCurPage })).then(v => { })
                break;
            case "SWITCHBOX_GO_PREVPAGE":
            case "SWITCHBOX_GO_NEXTPAGE":
            case "SWITCHBOX_GO_HANDLE_KEYDOWN":
                PAGE_database.setItem(JSON.stringify(+new Date()), Object.assign({}, action, { curPage: coursewareCurPage })).then(v => { })
                break;
        }
    }).catch((err) => {
        console.log(err);
    });
}

export default signalMessage