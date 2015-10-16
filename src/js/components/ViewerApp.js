var React = require('react');
var LoadingPage = require('./LoadingPage');
var ErrorPage = require('./ErrorPage');
var MangaList = require('./MangaList');
var MangaViewer = require('./MangaViewer');

var request = require('superagent');

var ViewerApp = React.createClass({
  getInitialState: function () {
    return {searchKeyword: '', data: []};
  },

  componentWillMount: function () {
  },

  componentDidMount: function () {
    this._load();
    window.addEventListener('popstate', this._onPopState);
  },

  componentWillUnmount: function () {
    window.removeEventListener('popstate', this._onPopState);
  },

  render: function () {
    var content = null;
    switch (this.state.data.type) {
      case 'list':
        content = <MangaList keyword={this.state.searchKeyword} load={this._load} data={this.state.data.data}/>;
        break;
      case 'manga':
        content = <MangaViewer data={this.state.data} />;
        break;
      case 'error':
        content = <ErrorPage data={this.state.data} />;
        break;
      case 'loading':
        content = <LoadingPage />;
        break;
    }

    return (
      <div>
        <div className="content">
          {content}
        </div>
      </div>
    );
  },

  _search: function (keyword) {
    this.setState({searchKeyword: keyword});
  },

  _initUrl: function () {
    return location.search.indexOf('?link=http') === 0
      ? decodeURIComponent(location.search.substr(6)) : '';
  },

  _load: function (url) {
    this.setState({data:{type:'loading'}});
    var encoded = encodeURIComponent(url || this._initUrl());
    var newLocation = location.origin + (!encoded ? '' : '/?link=' + encoded);
    if (history.state && newLocation != location.href) {
      history.pushState(null, '', newLocation);
    }
    request
      .get('/api/?link=' + encoded)
      .accept('json')
      .end(function (res) {
        // If list has one manga, load that immediately.
        if (res.body.type === 'list' && res.body.data.length === 1) {
          this._load(res.body.data[0].link);
          return;
        }
        this.setState({searchKeyword:'', data: res.body});
        history.replaceState(this.state, this.state.title, newLocation);
        scrollTo(0, 0);
        document.title = res.body.title;
      }.bind(this));
  },

  _onPopState: function (e) {
    if (e.state) {
      this.setState(e.state);
    } else {
      _load();
    }
  }
});

module.exports = ViewerApp;
