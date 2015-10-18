import React, { Component } from 'react-native'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux/native'
import thunk from 'redux-thunk'

//import * as reducers from '../reducers';
import ViewerApp from './ViewerApp';

import FetchTest from './FetchTest';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
//const reducer = combineReducers(reducers);
//const store = createStoreWithMiddleware(reducer);

export default class App extends Component {
  render () {
    return <FetchTest />
  }
  render1 () {
    return (
      <Provider store={store}>
        {() => <ViewerApp />}
      </Provider>
    );
  }
}
