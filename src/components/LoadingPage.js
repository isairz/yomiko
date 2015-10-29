var React = require('react');
var Spinner = require('react-spinner');

var ErrorPage = React.createClass({
  render: function () {
    var link = this._getLink();
    return (
      <div className="loading-page">
        <Spinner className="spinner" />
      </div>
    );
  },

  _getLink: function () {
    return decodeURIComponent(location.search.substr(6));
  }
});

module.exports = ErrorPage;
