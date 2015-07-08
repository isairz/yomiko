import '../assets/stylesheets/index.css'
import React from 'react'
import BrowserHistory from 'react-router/lib/BrowserHistory'
import Root from './Root'

// Use hash location for Github Pages
// but switch to HTML5 history locally.
const history = new BrowserHistory()

React.render(<Root history={history} />, document.getElementById('app'))
