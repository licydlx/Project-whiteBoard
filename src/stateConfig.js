/**
 * course : 课件区
 * 1.show : 是否显示
 * 2.link : 课件URL
 */

/**
 * switchPage : 切换栏目
 * 1.show : 是否显示
 * 2.leftIcon : 左键状态
 * 3.rightIcon : 右键状态
 * 4.currentPage : 当前页面
 * 5.totalPage : 全部页面
 * 6.fullScreen : 是否全屏
 */

/**
* brush : 画板区
* 1.show : 是否显示
* 2.sketchpad :
*        1.type : 工具类型
*        2.penSize : 笔尺寸
*        3.textSize : 文本尺寸
*        4.penColor : 笔颜色 
*        5.penShape : 画形状  
*/

const stateConfig = {
    course: {
        show: false,
        link:'',
        // 'https://www.kunqu.tech/page1/'
        // 'http://event.img.huabanimg.com/wsjd2019/kv.jpg'
        // 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf'
    },

    switchPage: {
        show: false,
        leftIcon: false,
        rightIcon: true,
        currentPage: 1,
        totalPage: 4,
        fullScreen: false
    },

    brush: {
        show: false,
        sketchpad:{
            type:'sketchpad',
            penSize: 2,
            textSize: 14,
            penColor: '#fff',
            penShape: ''
        }
    },

    role: 0
}

export default stateConfig;