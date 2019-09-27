/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-21 11:01:55
 * @LastEditTime: 2019-09-27 12:27:19
 * @LastEditors: Please set LastEditors
 */
import SignalData from './SignalData';

function signalMessage() {
    return (next) => (action) => {
        console.log('⛈🌪🌫🌬🌚')
        console.log('白板 will dispatch', action)
        console.log('☔🐟🐒🐬☔')

        if (SignalData.playback) {
            // 回放为真时 画板逻辑
            switch (action.type) {
                // 课件通信，声网信令传输 
                case "CHILD_MESSAGE_BOX":
                    window.whiteBoardMessage.sendMessage("child", JSON.stringify({ type: action.data.type, handleData: action.data.handleData }));
                    break;
            }
        } else {
            // 不是回放 才存储

            // localStorage 存储 actions
            switch (action.type) {
                case "BOARD_SHOW_TOOLBAR":              // 老师显示画板工具栏
                case "BOARD_HIDE_TOOLBAR":
                case "SWITCHBOX_SHOW_SWITCHBAR":        // 老师显示切换工具栏 
                case "SWITCHBOX_SET_TOTAL_PAGE":        // 设置课件总页数 
                case "BOARD_REDUCE_TOOLBAR":
                case "SWITCHBOX_GO_DEFAULT_VALUE":      // 初始化切换值
                case "LOADING_SWITCH":                  // loading动图
                case "CHILD_MESSAGE_BOX":               // 课件状态不保存
                    break;
                case "COURSEWARE_SWITCH_TYPE":
                    switch (action.name) {
                        case "html5":
                        case "pdf":
                            window.ACTIONS_database.length().then((numberOfKeys) => {
                                if (numberOfKeys > 0) {
                                    window.ACTIONS_database.key(0).then(keyName => {
                                        window.ACTIONS_database.getItem(keyName).then(keyValue => {
                                            if (action.link !== keyValue.link) {
                                                window.ACTIONS_database.clear();
                                                window.BOARD_database.clear();
                                                window.PAGE_database.clear();

                                                actionDataSave(action);
                                            }
                                        })
                                    })
                                } else {
                                    actionDataSave(action);
                                }
                            })

                            break;
                        case "default":
                            window.ACTIONS_database.clear();
                            window.BOARD_database.clear();
                            window.PAGE_database.clear();
                            break;
                        default:
                            break;
                    }
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
                case "BOARD_HIDE_TOOLBAR":
                case "BOARD_REDUCE_TOOLBAR":
                case "LOADING_SWITCH":
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
        let returnValue = next(action);
        return returnValue;
    }
}

const actionDataSave = (action) => {
    if(action.type == "BOARD_ADD_TEXT"){
        console.log(action)
    }
    window.ACTIONS_database.setItem(JSON.stringify(+new Date()), action).then(() => {
        switch (action.type) {
            case "BOARD_SWITCH_TOOLBAR":
            case "BOARD_TOGGLE_TOOLBAR":
            case "BOARD_POSITION_TOOLBAR":
            case "BOARD_CHANGE_PENSIZE":
            case "BOARD_CHANGE_PENCOLOR":
            case "BOARD_CHANGE_TEXTSIZE":
            case "BOARD_CHANGE_PENSHAPE":
            case "BOARD_ADD_PATH":
            case "BOARD_ADD_TEXT":
            case "BOARD_ADD_GRAPH":
            case "BOARD_REMOVE_CREATED":
            case "CHILD_MESSAGE_BOX":
                window.BOARD_database.setItem(JSON.stringify(+new Date()), Object.assign({}, action, { account: SignalData.account, curPage: window.coursewareCurPage }));
                break;
            case "SWITCHBOX_GO_HANDLE_KEYDOWN":
                if (action.code == "Enter" || action.code == "left" || action.code == "right") {
                    window.PAGE_database.setItem(JSON.stringify(+new Date()), Object.assign({}, action, { curPage: window.coursewareCurPage }));
                }

                break;
        }
    }).catch((err) => {
        console.log(err);
    });
}

export default signalMessage