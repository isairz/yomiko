import React from 'react'
import BrowserHistory from 'react-router/lib/BrowserHistory'
import AppRoutes from './AppRoutes'

// Use hash location for Github Pages
// but switch to HTML5 history locally.
const history = new BrowserHistory()

React.render(<AppRoutes history={history} />, document.getElementById('app'))
