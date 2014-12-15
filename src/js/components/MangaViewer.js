var React = require('react');
var Hammer = require('hammerjs');

var requestAnimationFrame = window.requestAnimationFrame || (function() {
  return window[Hammer.prefixed(window, "requestAnimationFrame")] || function(callback) {
    setTimeout(callback, 1000 / 60);
  }
})();

var MangaPage = React.createClass({
  getInitialState: function () {
    return {loaded: false, proxy: false, retried: 0};
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

    var pageStyle = {};
    if (this.props.preload) {
      pageStyle.backgroundImage = 'url(' + this._src() + ')';
    }

    var translateX = this.props.translateX;
    if (translateX) {
      pageStyle.display = 'block';
      pageStyle.transform =
        'translate3d(' + (translateX + (this.props.offset|this.props.offset.x)) + '%,' + (this.props.offset|this.props.offset.y) + '%, 0)';
    }

    return (
      <div
        className={'page ' + this.props.position + (this.props.animate ? ' effect':'')}
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
  }
});

var MangaViewer = React.createClass({
  getInitialState: function () {
    return {
      page: 0,
      translateX: 0,
      animate: false
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

  render: function () {
    var self = this;
    var current = this.state.page;
    var pages = [].map.call(this.props.data.images, function (imgSrc, page) {
      // console.log();
      return (
        <MangaPage
          page={page}
          preload={page>=current-2 && page<=current+2}
          position={page===current ? 'current' : page<=current ? 'prev' : 'next'}
          offset={page===current-1 ? {x: 100} : page===current+1 ? {x: -100} : {}}
          translateX={(page>=current-1 && page<=current+1) ? self.state.translateX : null}
          animate={(page>=current-1 && page<=current+1) ? self.state.animate : false}
          src={imgSrc}
        />
      );
    });

    return (
      <div className="mangaview">
        <div className="slider">
          {pages}
        </div>
      </div>
    );
  },

  _onKeyDown: function (e) {
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

    var update = function () {
      if(!ticking) {
        ticking = true;
        requestAnimationFrame(function () {
          var newState = {translateX: translateX, animate: animate};
          if (deltaPage) {
             newState.page = self.state.page + deltaPage;
             deltaPage = 0;
          }
          self.setState(newState);
          ticking = false;
        });
      }
    }

    var onPan = function (e) {
      translateX = (100 / self.getDOMNode().offsetWidth) * e.deltaX;

      if (e.type == 'panend' || e.type == 'pancancel') {
        if (Math.abs(translateX) > 10 && e.type == 'panend') {
          if (translateX < 0 && self.state.page > 0) {
            deltaPage = -1;
          } else if (translateX > 0 && self.state.page < self.props.data.images.length-1) {
            deltaPage = 1;
          }
        }

        translateX = 0;
        animate = true;
      } else {
        animate = false;
      }
      update();
    }

    var onDoubleTap = function (e) {
      self._toggleFullScreen();
    }

    hammer = new Hammer.Manager(this.getDOMNode());
    hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 }));
    hammer.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
    hammer.on("panstart panmove panend pancancel", Hammer.bindFn(onPan, this));
    hammer.on("doubletap", Hammer.bindFn(onDoubleTap, this));
  },


  _prevPage: function () {
    if (this.state.page <= 0) {
      return;
    }
    this.setState({page: this.state.page-1});
  },

  _nextPage: function () {
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
