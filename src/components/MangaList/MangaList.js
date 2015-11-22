import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { Navbar, NavBrand, Nav, NavItem, CollapsibleNav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { goBack } from 'redux-router';
import { load } from 'redux/modules/scrap';
import { BackgroundImage } from 'components';
// import {GridList, GridTile} from 'material-ui';

const MangaNode = (props) => {
  const {thumbnail, link, title, hidden} = props;
  let proxy = false;
  const styles = require('./MangaList.scss');

  if (thumbnail && thumbnail.indexOf('marumaru.in/') >= 0) {
    proxy = true;
  }

  return (
    <li className={styles.item}>
      <IndexLink to={'/scrap?link=' + encodeURIComponent(link)} rawurl={link}>
        <BackgroundImage className={styles.thumbnail} src={thumbnail} proxy={proxy} lazy={hidden}/>
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
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this);
    window.addEventListener('scroll', this);
    this.lazyLoad();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this);
    window.removeEventListener('resize', this);
  }

  handleEvent() {
    this.lazyLoad();
  }

  lazyLoad() {
    const container = this.refs.container;
    const node = container.querySelector('li');
    const containerWidth = container.getClientRects()[0].width;
    const nodeWidth = node.getBoundingClientRect().width;
    const nodeHeight = node.getBoundingClientRect().height;

    const top = window.scrollY;
    const bottom = top + window.innerHeight;
    const cols = Math.floor(containerWidth / nodeWidth);
    const firstElement = Math.floor(top / nodeHeight) * cols;
    const lastElement = Math.floor(bottom / nodeHeight + 1) * cols - 1;

    if (firstElement < this.state.firstElement || lastElement > this.state.lastElement) {
      this.setState({
        firstElement: firstElement - 1 * cols,
        lastElement: lastElement + 3 * cols,
      });
    }
  }

  render() {
    const {className, list, title} = this.props;
    const styles = require('./MangaList.scss');
    return (
      <div className={styles[className]}>
        <Navbar fixedTop toggleNavKey={0}>
          <NavBrand>
            <a href="#" onClick={this.props.goBack}>
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
        <ul className={styles.container} ref="container">
          {list.map((item, idx) => <MangaNode {...item} key={item.link} hidden={idx < this.state.firstElement || idx > this.state.lastElement}/>)}
        </ul>
      </div>
    );
  }
}
