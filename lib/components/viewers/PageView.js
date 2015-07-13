import React, { PropTypes } from 'react'
import { AppBar, Styles, Mixins } from 'material-ui'
import Hammer from 'hammerjs'
import { PROXY_SERVER } from '../../../config'

const { Colors } = Styles
const { StylePropable } = Mixins

const isMac = navigator.userAgent.toUpperCase().indexOf('MAC') >= 0

class TouchManager {

  component = {}

  state = {
    wheelDelta: 0,
    deltaPage: 0,
    translateX: 0,
    ticket: true,
    animate: false,
  }

  constructor (component) {
    this.component = component
    this.hammer = new Hammer.Manager(React.findDOMNode(component))
    this.hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 }))
    this.hammer.add(new Hammer.Tap({ event: 'singletap' }))
    this.hammer.on('panstart panmove panend pancancel', Hammer.bindFn(this.onPan, this))
    this.hammer.on('singletap', Hammer.bindFn(this.onTap, this))

    // for MacBook TrackPad
    if (isMac)
      this.onWheel = this.onWheelMac.bind(this)
    else
      this.onWheel = this.onWheel.bind(this)

    window.addEventListener('wheel', this.onWheel)
  }

  destroy () {
    this.hammer.stop()
    this.hammer.destroy()
    window.removeEventListener('wheel', this.onWheel)
  }

  update () {
    if (this.state.ticket) {
      this.state.ticket = false
      requestAnimationFrame(() => {
        const comp = this.component
        const { deltaPage, translateX, animate } = this.state
        if (deltaPage) {
          if (deltaPage < 0)
            comp.goRightPage()
          else
            comp.goLeftPage()

          this.state.deltaPage = 0
        }
        const newState = {
          translateX: translateX,
          animate: animate,
        }
        comp.setState(newState)
        this.state.ticket = true
      })
    }
  }

  onPan (e) {
    e.preventDefault()
    this.state.translateX = e.deltaX * (100 / React.findDOMNode(this.component).offsetWidth)

    if (e.type === 'panend' || e.type === 'pancancel') {
      if (Math.abs(this.state.translateX) > 10 && e.type === 'panend')
        if (this.state.translateX < 0)
          this.state.deltaPage -= 1
        else if (this.state.translateX > 0)
          this.state.deltaPage += 1

      if (this.animateTimer)
        clearTimeout(this.animateTimer)

      this.animateTimer = setTimeout(() => {
        this.state.animate = false
        this.update()
      }, 200)

      this.state.animate = true
      this.state.translateX = 0
    }
    this.update()
  }

  onWheelMac (e) {
    function end () {
      if (this.state.wheelDelta <= -10)
        this.state.deltaPage += 1
      else if (this.state.wheelDelta >= 10)
        this.state.deltaPage -= 1

      this.state.wheelDelta = 0
      this.state.translateX = 0
      this.state.animate = true
      this.update()
    }

    e.preventDefault()
    const width = React.findDOMNode(this.component).offsetWidth
    this.state.wheelDelta += e.deltaX / width * 100
    clearTimeout(this.wheelEndTimer)
    if (Math.abs(this.state.wheelDelta) > 10)
      end.bind(this)()
    else
      this.wheelEndTimer = setTimeout(() => end.bind(this)(), 100)

    this.state.translateX = -this.state.wheelDelta
    this.update()
  }

  onWheel (e) {
    e.preventDefault()
    if (e.deltaY > 0)
      this.component.goNextPage()
    else if (e.deltaY < 0)
      this.component.goPrevPage()
  }

  onTap () {
    this.component.toggleMenu()
  }
}

export default class PageView extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    list: PropTypes.array,
    goPrevChapter: PropTypes.func,
    goNextChapter: PropTypes.func,
  }

  constructor (props, context) {
    super(props, context)

    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  state = {
    menu: false,
    page: 0,
    translateX: 0,
    animate: false,
  }

  getStyles () {
    return {
      root: {
        background: Colors.black,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      },
      topBar: {
        position: 'fixed',
      },
      info: {
        position: 'fixed',
        left: '10px',
        top: '4px',
        color: '#c0c0c0',
        zIndex: 2,
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
        backgroundImage: '',
        zIndex: 0,
      },
    }
  }

  componentDidMount () {
    window.addEventListener('keydown', this.handleKeyDown)
    this.touchManager = new TouchManager(this)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKeyDown)
    this.touchManager.destroy()
  }

  componentDidUpdate (prevProps) {
    // TODO: check manga / manhwa type
    this.goLeftPage = this.goNextPage
    this.goRightPage = this.goPrevPage
    if (prevProps.list !== this.props.list)
      this.setState({ page: 0 })
  }

  render () {
    const styles = this.getStyles()
    const { title, list } = this.props
    const { menu, page, translateX, animate } = this.state
    const pageInfo = `${page + 1}/${list.length}`

    const mergedAppBarStyles = StylePropable.mergeAndPrefix(styles.topBar, { display: (menu ? 'flex' : 'none') })
    const makePage = (idx) => {
      const unloadedStyles = (idx >= page - 2 && idx <= page + 8) ? {} : styles.unloaded
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
        <div style={styles.info}>
          {pageInfo}
        </div>
        <AppBar
          onLeftIconButtonTouchTab={this.handleMenuClick}
          title={`${title} (${pageInfo})`}
          zDepth={2}
          style={mergedAppBarStyles}
          />

        <div style = {styles.wrap}>
          {list.map((_, idx) => makePage(idx))}
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
      case '[': case 'U+005B':
        this.goPrevChapter()
        break
      case ']': case 'U+005D':
        this.goNextChapter()
        break
      case ' ': case 'U+0020':
        if (e.shiftKey)
          this.goPrevPage()
        else
          this.goNextPage()
        break
      default :
        return
    }

    e.preventDefault()
  }

  toggleMenu () {
    this.setState({ menu: !this.state.menu })
  }

  goPrevPage () {
    if (this.state.page <= 0) {
      this.goPrevChapter()
      return
    }

    this.setState({ page: this.state.page - 1 })
  }

  goNextPage () {
    if (this.state.page >= this.props.list.length - 1) {
      this.goNextChapter()
      return
    }
    this.setState({ page: this.state.page + 1 })
  }

  goFirstPage () {
    this.setState({ page: 0 })
  }

  goLastPage () {
    this.setState({ page: this.props.list.length - 1 })
  }

  goPrevChapter () {
    if (this.props.goPrevChapter) {
      this.props.goPrevChapter()
      return
    }
  }

  goNextChapter () {
    if (this.props.goNextChapter) {
      this.props.goNextChapter()
      return
    }
  }
}
