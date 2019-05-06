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
* course : 课件区
* 1.show : 是否显示
* 2.link : 课件URL
*/

const stateConfig = {
    course: {
        show: true,
        link: 'https://www.kunqu.tech/page1/'
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
        show: true,
        sketchpad:{
            type:'sketchpad',
            penSize: 2,
            textSize: 14,
            penColor: '#fff',
            penShape: ''
        }
    },
}

export default stateConfig;