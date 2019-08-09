const defaultState = [
  {
    name: "board",
    active: true,
  },
  {
    name: "pen",
    active: false,
  },
  {
    name: "text",
    active: false,
  },
  {
    name: "graph",
    active: false,
  },
  {
    name: "empty",
    active: false,
  }
];

const sketchpadActive = (state = defaultState, action) => {
  switch (action.type) {
    case 'TOGGLE_SKETCHPAD':
      return state.map(tool =>
        (tool.name === action.name)
          ? { ...tool, active: true }
          : { ...tool, active: false }
      )
    default:
      return state
  }
}

export default sketchpadActive
