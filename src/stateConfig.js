const stateConfig = {
    showCourseware: {
        value: true,
        link: 'https://www.kunqu.tech/page1/'
    },

    showBrush: false,
    showSketchpad: false,
    showSwitchPage: false,

    tools: [
        {
            type: 'toolsBox',
            expand: false,
            imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/01double.png',
            attrStyle: null,
            state: false,
        },
        {
            type: 'sketchpad',
            state: true,
            imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/02double.png',
            attrStyle: null
        },
        {
            type: 'pen',
            state: false,
            imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/03double.png',
            attrStyle: {
                height: '120px'
            },
            attr: ['penSize', 'penColor']
        },
        {
            type: 'text',
            state: false,
            imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/04double.png',
            attrStyle: {
                height: '120px'
            },
            attr: ['textSize', 'penColor']
        },
        {
            type: 'graph',
            state: false,
            imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/07double.png',
            attrStyle: {
                height: '150px'
            },
            attr: ['penShape', 'penColor']
        },
        {
            type: 'remove',
            state: false,
            imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/06double.png',
            attrStyle: null
        },
        {
            type: 'empty',
            state: false,
            imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/05double.png',
            attrStyle: null
        },
    ],
    sketchpadConfig: {
        penSize: 2,
        textSize: 14,
        penColor: '#fff',
        penShape: ''
    },
    position: {
        top: '100px',
        right: '60px'
    },
    toolsCache: {
        preIndex: 1,
        preState: null
    },
    switchPage: {
        leftIcon: false,
        rightIcon: true,
        towardsPage: 1,
        totalPage: 4,
    }
}

export default stateConfig;