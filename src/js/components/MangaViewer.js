var React = require('react');
var Hammer = require('hammerjs');

// two page to one page.
// var autoSlice = window.innerWidth / window.innerHeight < 1;
var autoSlice = false;

var requestAnimationFrame = window.requestAnimationFrame || (function() {
  return window[Hammer.prefixed(window, "requestAnimationFrame")] || function(callback) {
    setTimeout(callback, 1000 / 60);
  }
})();

var MangaPage = React.createClass({
  getInitialState: function () {
    return {
      loaded: false,
      proxy: false,
      retried: 0,
      double: null
    };
  },

  render: function () {
    var preloadImage = null;
    src = this._src();
    if (this.props.preload) {
      preloadImage = (
        <img
          ref='image'
          src={this._src()}
          style={{display: 'none'}}
          onLoad={this._onLoad}
          onError={this._onError}
        />
      );
    }
    var classNames = ['page', this.props.position];
    if (this.props.animate) {
      classNames.push('effect');
    }

    var pageStyle = {};
    if (this.props.preload) {
      pageStyle.backgroundImage = 'url(' + this._src() + ')';
    }

    if (this.state.double) {
      classNames.push('double');
      classNames.push(this.state.double);
    }

    if (this.props.translateX) {
      var translateX = this.props.translateX + (this.props.offset|this.props.offset.x);
      if (this.state.double === 'right') {
        translateX /= 2;
      }
      if (this.state.double === 'left') {
        translateX = translateX / 2 + 50;
      }
      pageStyle.display = 'block';
      pageStyle.transform =
        'translate3d(' + translateX + '%,' + (this.props.offset|this.props.offset.y) + '%, 0)';
      pageStyle.webkitTransform = pageStyle.transform;
    }

    return (
      <div
        className={classNames.join(' ')}
        style={pageStyle}
      >
        {preloadImage}
         <div className={'loading-message' + (this.state.loaded ? ' hidden_elem' : '')}>
           <span className='fade-color'>
             {!this.state.retried ? 'Loading image..' : 'Retry..(' + this.state.retried + ')'}
           </span>
         </div>
      </div>
    );
  },

  _onLoad: function () {
    var img = this.refs.image.getDOMNode();
    if (autoSlice && img.naturalWidth / img.naturalHeight > 1.2) {
      this.setState({double: 'right'});
    }
    this.setState({loaded: true});
  },

  _onError: function () {
    this._retryWithProxy();
  },

  _src: function () {
    var src = this.props.src;
    if (this.state.retried) {
      src += (src.indexOf('?') >= 0 ? '&' : '?') + 'retried=' + this.state.retried;
    }
    if (this.state.proxy) {
      src = ('/image-proxy?src=' + encodeURIComponent(src));
    }
    return src;
  },

  _retryWithProxy: function () {
    if (!this.state.proxy) {
      this.setState({proxy: true, retried: this.state.retried+1});
      return;
    }
    setTimeout(this.setState.bind(this, {retried: this.state.retried+1}), 1000);
  },

  _prevPage: function() {
    if (this.state.double != 'left') {
      return false;
    }
    this.setState({double: 'right'});
    return true;
  },

  _nextPage: function() {
    if (this.state.double != 'right') {
      return false;
    }
    this.setState({double: 'left'});
    return true;
  }
});

var MangaViewer = React.createClass({
  getInitialState: function () {
    return {
      page: 0,
      translateX: 0,
      animate: false,
      preloadStart: 0,
      preloadEnd: 5,
    };
  },

  componentDidMount: function () {
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('wheel', this._onWheel);
    this._initTouch();
  },

  componentWillUnmount: function () {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('wheel', this._onWheel);
    // FIXME: detach touch event.
  },

  componentWillUpdate: function (nextProps, nextState) {
    if (!nextState.animate && !nextState.translateX) {
      nextState.preloadStart = nextState.page - 1;
      nextState.preloadEnd = nextState.page + 5;
    }
  },

  render: function () {
    var self = this;
    var current = this.state.page;
    var pages = [].map.call(this.props.data.images, function (imgSrc, page) {
      return (
        <MangaPage
          ref={page===current ? 'current' : ''}
          page={page}
          preload={page>=self.state.preloadStart && page<=self.state.preloadEnd}
          position={page===current ? 'current' : page<=current ? 'prev' : 'next'}
          offset={page===current-1 ? {x: 100} : page===current+1 ? {x: -100} : {}}
          translateX={(page>=current-1 && page<=current+1) ? self.state.translateX : null}
          animate={(page>=current-1 && page<=current+1) ? self.state.animate : false}
          src={imgSrc}
        />
      );
    });

    var info = this.props.data.title + ' ' + (current + 1) + '/' + this.props.data.images.length;

    return (
      <div className="mangaview">
        <div className="info">
          {info}
        </div>
        <div className="slider">
          {pages}
        </div>
      </div>
    );
  },

  _onKeyDown: function (e) {
    e.preventDefault();
    switch(e.key || e.keyIdentifier) {
      case 'Up':
      case 'Right':
      case 'PageUp':
        this._prevPage();
        break;
      case 'Down':
      case 'Left':
      case 'PageDown':
        this._nextPage();
        break;
      case 'Home':
        this._firstPage();
        break;
      case 'End':
        this._lastPage();
        break;
    }
  },

  _onWheel: function (e) {
    e.preventDefault();
    if (e.deltaY < 0) {
      this._prevPage();
    } else if (e.deltaY > 0) {
      this._nextPage();
    }
  },

  _initTouch: function () {
    var self = this;
    var hammer;
    var deltaPage = 0;
    var translateX = 0;
    var ticking = false;
    var animate = false;
    var animateTimer = null;

    var update = function () {
      if(!ticking) {
        ticking = true;
        requestAnimationFrame(function () {
          var newState = {translateX: translateX, animate: animate};
          if (deltaPage) {
            if (deltaPage < 0) {
              self._prevPage();
            } else {
              self._nextPage();
            }
            deltaPage = 0;
          }
          self.setState(newState);
          ticking = false;
        });
      }
    }

    var onPan = function (e) {
      e.preventDefault();
      translateX = (100 / self.getDOMNode().offsetWidth) * e.deltaX;

      if (e.type == 'panend' || e.type == 'pancancel') {
        if (Math.abs(translateX) > 10 && e.type == 'panend') {
          if (translateX < 0 && self.state.page > 0) {
            deltaPage += -1;
          } else if (translateX > 0 && self.state.page < self.props.data.images.length-1) {
            deltaPage += 1;
          }
        }

        translateX = 0;
        animate = true;
        if (animateTimer) {
          clearTimeout(animateTimer);
        }
        animateTimer = setTimeout(function() {
          animate = false;
          update();
        }, 200);
      }
      update();
    }

    var onDoubleTap = function (e) {
      e.preventDefault();
      self._toggleFullScreen();
    }

    hammer = new Hammer.Manager(this.getDOMNode());
    hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 }));
    hammer.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
    hammer.on("panstart panmove panend pancancel", Hammer.bindFn(onPan, this));
    hammer.on("doubletap", Hammer.bindFn(onDoubleTap, this));
  },


  _prevPage: function () {
    if (this.refs.current && this.refs.current._prevPage()) {
      return;
    }
    if (this.state.page <= 0) {
      return;
    }
    this.setState({page: this.state.page-1});
  },

  _nextPage: function () {
    if (this.refs.current && this.refs.current._nextPage()) {
      return;
    }
    if (this.state.page >= this.props.data.images.length-1) {
      return;
    }
    this.setState({page: this.state.page+1});
  },

  _firstPage: function () {
    this.setState({page: 0});
  },

  _lastPage: function () {
    this.setState({page: this.props.data.images.length-1});
  },

  _toggleFullScreen: function () {
    var doc = window.document;
    var docEl = this.getDOMNode();

    var requestFullScreen = docEl.requestFullscreen
      || docEl.mozRequestFullScreen
      || docEl.webkitRequestFullScreen
      || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen
      || doc.mozCancelFullScreen
      || doc.webkitExitFullscreen
      || doc.msExitFullscreen;

    if (!doc.fullscreenElement
      && !doc.mozFullScreenElement
      && !doc.webkitFullscreenElement
      && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    } else {
      cancelFullScreen.call(doc);
    }
  }
});

module.exports = MangaViewer;
