import React, { AppRegistry, Component } from 'react-native'
import { Provider } from 'react-redux/native'
import createMemoryHistory from 'history/lib/createMemoryHistory'
import App from './src/App'
import stores from './src/stores'

var store = stores();

class yomiko extends Component {
  render () {
    return <App />;
    return (
      <Provider store={store}>
        {() => <App />}
      </Provider>
    );
  }
}

AppRegistry.registerComponent('yomiko', () => yomiko);
