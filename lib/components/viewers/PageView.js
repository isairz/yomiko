import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { AppCanvas, AppBar, Paper, Styles, Mixins } from 'material-ui'
import { PROXY_SERVER } from '../../../config'

const { Colors, Typography } = Styles
const { StylePropable } = Mixins
const ThemeManager = new Styles.ThemeManager()

var isMac = navigator.userAgent.toUpperCase().indexOf('MAC')>=0;

function handleWheel() {

  // for MacBook TrackPad
  if (isMac) {
    let wheelDelta = 0
    let wheelEndTimer
    let animateTimer
    function end() {
      if (wheelDelta <= -40) {
        this.goLeftPage()
      } else if (wheelDelta >= 40) {
        this.goRightPage()
      }
      wheelDelta = 0;
      this.setState({translateX: 0, animate: true})
      animateTimer = setTimeout(() => {animateTimer=undefined; this.setState({animate: false})}, 200)
    }
    return function move(e) {
      e.preventDefault()
      const width = React.findDOMNode(this).offsetWidth
      wheelDelta += e.deltaX/width * 100;
      clearTimeout(wheelEndTimer)
      if (Math.abs(wheelDelta) > 40) {
        end.bind(this)()
      } else {
        wheelEndTimer = setTimeout(end.bind(this), 40)
      }
      this.setState({translateX: -wheelDelta})
    }
  } else {
    return function (e) {
      e.preventDefault()
      if (e.deltaY > 0) {
        this.goNextPage()
      } else if (e.deltaY < 0) {
        this.goPrevPage()
      }
    }
  }
}
export default class PageView extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    list: PropTypes.array,
  }

  static childContextTypes = {
    muiTheme: PropTypes.object
  }

  constructor (props, context) {
    super(props, context)

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleWheel = handleWheel().bind(this)
  }

  state = {
    page: 0,
    translateX: 0,
    animate: false,
  }

  getChildContext () {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  getStyles () {
    return {
      root: {
        background: Colors.black,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      },
      appBar: {
        position: 'fixed',
        display: 'none',
      },
      wrap: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      },
      page: {
        width: '100%',
        height: '100%',
        margin: '0',
        top: 0,
        left: 0,
        position: 'absolute',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        zIndex: 1,
        display: 'block',
      },
      effect: {
        transition: 'transform 200ms cubic-bezier(0.26, 0.86, 0.44, 0.985)',
      },
      unloaded: {
        backgroundImage : '',
        zIndex: 0,
      }
    }
  }

  componentDidMount () {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('wheel', this.handleWheel)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('wheel', this.handleWheel)
  }

  componentDidUpdate (prevProps) {
    // TODO: check manga / manhwa type
    this.goLeftPage = this.goNextPage
    this.goRightPage = this.goPrevPage
  }


  render () {
    const styles = this.getStyles()
    const { title, list } = this.props
    const { page, translateX, animate } = this.state
    const makePage = (idx) => {
      const unloadedStyles = (idx >= page - 2 && idx <= page + 8) ? {} : styles.unloaded;
      const x = (idx >= page - 1 && idx <= page + 1 ? translateX : 0)
        + (idx === page ? 0 : idx < page ? 100 : -100)
      const mergedStyles = StylePropable.mergeAndPrefix(
        {
          backgroundImage: `url(${PROXY_SERVER}/?src=${encodeURIComponent(list[idx].Src)})`,
          transform: `translate3d(${x}%, 0, 0)`,
        },
        animate && styles.effect,
        styles.page,
        //positionStyles,
        unloadedStyles,
        )
      return <div style={mergedStyles}></div>
    }

    return (
      <div style={styles.root}>
        <AppBar
          onLeftIconButtonTouchTab={this.handleMenuClick}
          title={title}
          zDepth={2}
          style={styles.appBar}
          />

        <div style = {styles.wrap}>
          {list.map((page, idx) => makePage(idx))}
        </div>
      </div>
    )
  }


  handleKeyDown (e) {
    switch(e.key || e.keyIdentifier) {
      case 'Up':
      case 'PageUp':
        this.goPrevPage()
        break
      case 'Down':
      case 'PageDown':
        this.goNextPage()
        break
      case 'Left':
        this.goLeftPage()
        break
      case 'Right':
        this.goRightPage()
        break
      case 'Home':
        this.goFirstPage()
        break
      case 'End':
        this.goLastPage()
        break
      case 'U+0020': //space-bar
        if (e.shiftKey) {
          this.goPrevPage()
        } else {
          this.goNextPage()
        }
        break
      default :
        return
    }

    e.preventDefault()
  }

  goPrevPage () {
    if (this.state.page <= 0) {
      return
    }
    
    this.setState({ page: this.state.page - 1 })
  }

  goNextPage () {
    if (this.state.page >= this.props.list.length - 1) {
      return
    }
    this.setState({ page: this.state.page + 1 });
  }

  goFirstPage () {
    this.setState({ page: 0 });
  }

  goLastPage () {
    this.setState({ page: this.props.list.length - 1 });
  }
}
