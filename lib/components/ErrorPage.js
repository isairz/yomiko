var React = require('react');

var ErrorPage = React.createClass({
  render: function () {
    var link = this._getLink();
    return (
      <div className="error-page">
        <h1>{this.props.data.message}</h1>
        <h2>No image... Please visit the link directly.</h2>
        <a href={link} target={"_blank"}><h4>{link}</h4></a>
      </div>
    );
  },

  _getLink: function () {
    return decodeURIComponent(location.search.substr(6));
  }
});

module.exports = ErrorPage;