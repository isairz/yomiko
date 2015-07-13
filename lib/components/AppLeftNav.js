import React from 'react'
import { LeftNav } from 'material-ui'

const menuItems = [
  { route: 'home', text: 'Home' },
]

export default class AppLeftNav extends React.Component {

  render () {
    return (
      <LeftNav
        menuItems={menuItems}
      />
    )
  }
}
