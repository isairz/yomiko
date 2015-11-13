const LOAD = 'redux-example/scrap/LOAD';
const LOAD_SUCCESS = 'redux-example/scrap/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/scrap/LOAD_FAIL';

const initialState = {
  loaded: false
};

export default function scrap(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.scrap && globalState.scrap.loaded;
}

export function load(uri) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/scrap' + (!uri ? '' : '/?link=' + encodeURIComponent(uri)))
  };
}
