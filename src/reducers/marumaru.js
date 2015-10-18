import * as types from '../actions/actionTypes';

const initialState = {
  data: null,
}

export default function counter(state = initialState, action = {}) {
  switch (action.type) {
    case types.FETCH_MANGA_LIST:
      return {
        ...state,
        data: null,
      };
    default:
      return state;
  }
}
