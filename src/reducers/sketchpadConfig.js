const defaultState = {
  penSize: "2",
  penColor: "#fff",
  textSize: "14",
  penShape: ""
};

const sketchpadConfig = (state = defaultState, action) => {
  switch (action.type) {
    case 'CONFIG_SKETCHPAD':
      return Object.assign({},state,action.type);
    default:
      return state
  }
}

export default sketchpadConfig
