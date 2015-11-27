import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { Navbar, NavBrand, Nav, NavItem, CollapsibleNav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { goBack } from 'redux-router';
import { load } from 'redux/modules/scrap';
import { BackgroundImage } from 'components';
// import {GridList, GridTile} from 'material-ui';

const crossOriginServer = /marumaru\.in\/|fuwarinn\.com/;

const MangaNode = (props) => {
  const {thumbnail, link, title, hidden, style} = props;
  let proxy = false;
  const styles = require('./MangaList.scss');

  if (thumbnail && thumbnail.match(crossOriginServer)) {
    proxy = true;
  }

  return (
    <li className={styles.item} style={style}>
      <IndexLink to={'/scrap?link=' + encodeURIComponent(link)} rawurl={link}>
        <BackgroundImage className={styles.thumbnail} src={thumbnail} proxy={proxy} lazy={hidden} options={{height: 270}}/>
        <div className={styles.textwrap}>
          <div className={styles.title}>{title}</div>
        </div>
      </IndexLink>
    </li>
  );
};

@connect(
  () => ({}),
  {goBack, load})
export default class MangaList extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    goBack: PropTypes.func.isRequired,
  }

  static defaultProps = {
    className: 'list',
  }

  constructor(props) {
    super(props);
    this.state = {
      firstElement: 0,
      lastElement: 11,
      cols: 1,
      containerWidth: 0,
      containerHeight: 0,
      nodeWidth: 0,
      nodeHeight: 0,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this);
    window.addEventListener('scroll', this);
    this.calculateSize();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this);
    window.removeEventListener('resize', this);
  }

  handleEvent() {
    this.calculateSize();
  }

  calculateSize() {
    const container = this.refs.container;
    const containerWidth = container.getClientRects()[0].width;

    let cols;
    let nodeWidth;
    let nodeHeight;
    if (this.props.className === 'list') {
      cols = 1;
      nodeWidth = containerWidth;
      nodeHeight = 58;
    } else {
      cols = Math.floor(containerWidth / 170) + 1; // FIXME: baseWidth
      nodeWidth = containerWidth / cols;
      nodeHeight = nodeWidth * 1.58; // FIXME: ratio
    }
    const containerHeight = nodeHeight * (Math.floor((this.props.list.length - 1) / cols) + 1);
    this.setState({
      cols,
      containerWidth,
      containerHeight,
      nodeWidth,
      nodeHeight,
    });

    const top = window.scrollY;
    const bottom = top + window.innerHeight;
    const firstElement = Math.floor(top / nodeHeight) * cols;
    const lastElement = Math.floor(bottom / nodeHeight + 1) * cols;

    if (firstElement < this.state.firstElement || lastElement > this.state.lastElement) {
      this.setState({
        firstElement: Math.max(firstElement - 1 * cols, 0),
        lastElement: lastElement + 3 * cols,
      });
    }
  }

  goBack(event) {
    this.props.goBack();
    event.preventDefault();
  }

  render() {
    const { className, list, title } = this.props;
    const { firstElement, lastElement, containerWidth, containerHeight, nodeWidth, nodeHeight, cols } = this.state;
    const styles = require('./MangaList.scss');

    return (
      <div className={styles[className]}>
        <Navbar fixedTop toggleNavKey={0}>
          <NavBrand className={styles.brand}>
            <a href="#" onClick={this.goBack.bind(this)}>
              <div className={styles.goback}>
                <i className="fa fa-chevron-left"></i>
              </div>
              <span>{title}</span>
            </a>
          </NavBrand>

          <CollapsibleNav eventKey={0}>
            <Nav navbar>
              <LinkContainer to="/scrap">
                <NavItem eventKey={2}>Scrap</NavItem>
              </LinkContainer>
            </Nav>
          </CollapsibleNav>
        </Navbar>
        <div className={styles.container + ' container'} ref="container">
          <ul style={{width: containerWidth, height: containerHeight}}>
            {list.slice(firstElement, lastElement).map((item, idx) => {
              const ii = firstElement + idx;
              return (<MangaNode {...item}
                key={item.link}
                style={{
                  width: nodeWidth,
                  height: nodeHeight,
                  transform: `translate3d(${nodeWidth * (ii % cols)}px, ${nodeHeight * Math.floor(ii / cols)}px, 0)`,
                }}/>);
            })}
          </ul>
        </div>
      </div>
    );
  }
}
