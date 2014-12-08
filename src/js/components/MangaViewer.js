var React = require('react');

var MangaPage = React.createClass({
  getInitialState: function () {
    return {loaded: false, proxy: false};
  },

  render: function () {
    var preloadImage = null;
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
    return (
      <div
        className={'page ' + this.props.position}
        style={{
          backgroundImage: 'url(' + (!this.state.loaded ? '' : this._src()) + ')'
        }}
      >
        {preloadImage}
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
    return !this.state.proxy ? this.props.src
      : ('/image-proxy?src=' + encodeURIComponent(this.props.src));
  },

  _retryWithProxy: function () {
    this.setState({proxy: true});
  }
});

var MangaViewer = React.createClass({
  getInitialState: function () {
    return {page: 0};
  },

  componentDidMount: function () {
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('wheel', this._onWheel);
  },

  componentWillUnmount: function () {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('wheel', this._onWheel);
  },

  render: function () {
    var current = this.state.page;
    var pages = [].map.call(this.props.data.images, function (imgSrc, page) {
      // console.log();
      return (
        <MangaPage
          page={page}
          preload={page>=current-2 && page<=current+2}
          position={page===current ? 'current' : page<=current ? 'prev' : 'next'}
          src={imgSrc}
        />
      );
    });

    return (
      <div className="mangaview">
        <div className="slider">
          {pages}
        </div>
        <div className="--prev" onClick={this.prevPage} />
        <div className="--next" onClick={this.nextPage} />
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
  }
});

module.exports = MangaViewer;
