import React, {Component, PropTypes} from 'react';
import {BackgroundImage} from 'components';
const styles = require('./MangaViewer.scss');

export default class MangaViewer extends Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
  }

  componentDidMount() {
    const Swiper = require('swiper');
    this.swiper = new Swiper('.' + styles.container, {
      effect: 'none',
      onSlideChangeEnd: this.handleSlideChange.bind(this),
    });

    window.addEventListener('keydown', this);
    window.addEventListener('wheel', this);
    for (let index = 0; index <= 2; index++) {
      if (this.refs[index]) this.refs[index].load(true);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('wheel', this);
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

  handleSlideChange() {
    const {previousIndex, activeIndex} = this.swiper;
    const {refs} = this;
    let disableStart;
    let disableEnd;
    let enableStart;
    let enableEnd;

    if (previousIndex < activeIndex) {
      disableStart = previousIndex - 2;
      disableEnd = Math.min(previousIndex + 2, activeIndex - 3);
      enableStart = Math.max(activeIndex - 2, previousIndex + 3);
      enableEnd = activeIndex + 2;
    } else {
      disableStart = Math.max(previousIndex - 2, activeIndex + 3);
      disableEnd = previousIndex + 2;
      enableStart = activeIndex - 2;
      enableEnd = Math.min(activeIndex + 2, previousIndex - 3);
    }

    for (let index = disableStart; index <= disableEnd; index++) {
      if (refs[index]) refs[index].load(false);
    }
    for (let index = enableStart; index <= enableEnd; index++) {
      if (refs[index]) refs[index].load(true);
    }
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
