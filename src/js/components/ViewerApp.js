/** @jsx React.DOM */
var React = require('react');
var MangaList = require('./MangaList');

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
    scrollTo(0, 0);
    var content = null;
    switch (this.state.data.type) {
      case 'list':
        content = <MangaList keyword={this.state.searchKeyword} load={this._load} data={this.state.data.data}/>;
        break;
      case 'manga':
        content = <MangaViewer data={this.state.data} />;
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
      ? decodeURIComponent(location.search.substr(6)) : 'http://marumaru.in/c/1';
  },

  _load: function (url) {
    var encoded = encodeURIComponent(url || this._initUrl());
    var newLocation = location.origin + '/?link=' + encoded;
    if (history.state && newLocation != location.href) {
      history.pushState(null, '', newLocation);
    }
    $.ajax({
      url: '/api/?link=' + encoded,
      dataType: 'json',
      success: function (data) {
        this.setState({searchKeyword:'', data: data});
        history.replaceState(this.state, data.title, newLocation);
      }.bind(this)
    });
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
