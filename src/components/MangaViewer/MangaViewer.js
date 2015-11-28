import React, {Component, PropTypes} from 'react';
import {BackgroundImage} from 'components';
const styles = require('./MangaViewer.scss');

export default class MangaViewer extends Component {

  static propTypes = {
    title: PropTypes.string,
    images: PropTypes.array.isRequired,
  }

  componentDidMount() {
    const Swiper = require('swiper');

    // FIXME: User option for wheel control style.
    const isMacLike = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
    this.swiper = new Swiper('.' + styles.container, {
      effect: 'none',
      mousewheelControl: isMacLike,
      iOSEdgeSwipeDetection: isMacLike,
      onSlideChangeStart: this.handleSlideChnageStart.bind(this),
      onSlideChangeEnd: this.handleSlideChangeEnd.bind(this),
    });

    window.addEventListener('keydown', this);
    if (!isMacLike) {
      window.addEventListener('wheel', this);
    }

    this.lastIndex = -10;
    this.handleSlideChnageStart();
    this.handleSlideChangeEnd();
  }

  componentWillUnmount() {
    const isMacLike = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
    if (!isMacLike) {
      window.removeEventListener('wheel', this);
    }
    window.removeEventListener('keydown', this);
  }

  handleEvent(event) {
    switch (event.type) {
      case 'keydown':
        this.handleKeyDown(event);
        break;
      case 'wheel':
        this.handleWheel(event);
        break;
      default:
        break;
    }
  }

  handleKeyDown(event) {
    switch (event.key || event.keyIdentifier) {
      case 'Up':
      case 'Right':
      case 'PageUp':
        event.preventDefault();
        this.prevPage();
        break;
      case 'Down':
      case 'Left':
      case 'PageDown':
        event.preventDefault();
        this.nextPage();
        break;
      case 'Home':
        event.preventDefault();
        this.firstPage();
        break;
      case 'End':
        event.preventDefault();
        this.lastPage();
        break;
      default:
        break;
    }
  }

  handleWheel(event) {
    event.preventDefault();
    if (event.deltaY < 0) {
      this.prevPage();
    } else if (event.deltaY > 0) {
      this.nextPage();
    }
  }

  handleSlideChnageStart() {
    // Update Page Information
    const {activeIndex} = this.swiper;
    const {title, images} = this.props;
    this.refs.info.textContent = `${title} ${activeIndex + 1}/${images.length}`;
  }

  handleSlideChangeEnd() {
    // Update Page image
    const {activeIndex} = this.swiper;
    const {lastIndex, refs} = this;

    if (lastIndex === activeIndex) {
      return;
    }

    let disableStart;
    let disableEnd;
    let enableStart;
    let enableEnd;

    if (lastIndex < activeIndex) {
      disableStart = lastIndex - 2;
      disableEnd = Math.min(lastIndex + 2, activeIndex - 3);
      enableStart = Math.max(activeIndex - 2, lastIndex + 3);
      enableEnd = activeIndex + 2;
    } else {
      disableStart = Math.max(lastIndex - 2, activeIndex + 3);
      disableEnd = lastIndex + 2;
      enableStart = activeIndex - 2;
      enableEnd = Math.min(activeIndex + 2, lastIndex - 3);
    }

    for (let index = disableStart; index <= disableEnd; index++) {
      if (refs[index]) refs[index].load(false);
    }
    for (let index = enableStart; index <= enableEnd; index++) {
      if (refs[index]) refs[index].load(true);
    }
    this.lastIndex = activeIndex;
  }

  prevPage() {
    this.swiper.slidePrev(true, 0);
  }

  nextPage() {
    this.swiper.slideNext(true, 0);
  }

  firstPage() {
    this.swiper.slideTo(0, 0, true);
  }

  lastPage() {
    const {images} = this.props;
    if (images && images.length) {
      this.swiper.slideTo(images.length - 1, 0, true);
    }
  }

  render() {
    const {images} = this.props;
    return (
      <div className={styles.container} dir="rtl">
        <div className={styles.info} ref="info"/>
        <div className={styles.wrapper + ' swiper-wrapper'}>
          {images.map((image, idx) => (
            <div className={styles.slide + ' swiper-slide'}>
              <BackgroundImage className={styles.page} ref={idx} src={image} proxy lazy/>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
