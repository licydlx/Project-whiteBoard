/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-18 17:19:11
 * @LastEditTime: 2019-09-18 19:02:12
 * @LastEditors: Please set LastEditors
 */

// 客户端 message 数据结构
//  {
//     sigType:"showCourseware",
//     sigValue:{
//         value:true,
//         link:""
//     }
//  }

//  客户端 返回message 数据结构改造
export const clientMessageADP = (data) => {
    let newData = {};
    switch (data.sigType) {
        case "showCourseware":
            newData.type = "COURSEWARE_SHOW"
            if (data.sigValue.value) {
                let tail = data.sigValue.link;
                switch (true) {
                    case tail.includes(".html"):
                        newData.handleData = {
                            name: "html5",
                            link: data.sigValue.link,
                            ratio: ""
                        }
                        break;
                    case tail.includes("pdf"):
                        newData.handleData = {
                            name: "pdf",
                            link: data.sigValue.link,
                            ratio: 4 / 3
                        }
                        break;
                    default:
                        console.log("COURSEWARE_SHOW:" + tail);
                        break;
                }
            } else {
                newData.handleData = {
                    name: "default",
                    link: "",
                    ratio: ""
                }
            }
            break;
        case "showBrush":
            newData.type = "BOARD_TOOLBAR";
            newData.handleData = {
                account: data.sigUid + "A",
                show: data.sigValue.value
            }

            break;
        default:
            break;
    }

    console.log(newData);
    return newData;
}