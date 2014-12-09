var React = require('react');

var MangaNode = React.createClass({
  render: function () {
    var imgSrc = this.props.data.thumbnail || '';
    if (imgSrc.indexOf('marumaru.in') >= 0) {
      imgSrc = '/image-proxy?src=' + imgSrc;
    }
    var link = this.props.data.link;

    return (
      <li className="manga">
        <a className={this.props.hidden ? 'hidden_elem' : ''} ref='link' href={link} onClick={this._onClick}>
          <div className="thumbnail" style={{backgroundImage:'url('+imgSrc+')'}} />
          <h3 className="title">{this.props.data.title}</h3>
        </a>
      </li>
    );
  },

  _onClick: function (e) {
    var url = this.refs.link.props.href;
    console.log(this.refs.link);
    this.props.load(url);
    e.stopPropagation();
    return false;
  }
});

var MangaList = React.createClass({
  getInitialState: function () {
    return {top: 0, bottom: 0};
  },

  componentDidMount: function () {
    this._onScroll();
  },

  render: function () {
    var heightPerNode = 112;
    var mangaNodes = this.props.data.filter(function (manga) {
      return manga.title.toLowerCase().indexOf(this.props.keyword.toLowerCase()) >= 0;
    }.bind(this))
    .map(function (manga, idx) {
      var position = idx * heightPerNode;
      return <MangaNode hidden={position < this.state.top || position > this.state.bottom} data={manga} load={this.props.load} />
    }.bind(this));

    return (
      <div className="listview" onScroll={this._onScroll}>
        <ul onScroll={this._onScroll}>
          {mangaNodes}
        </ul>
      </div>
    );
  },

  _onScroll: function(e) {
    this.setState({
      top: this.getDOMNode().scrollTop,
      bottom: this.getDOMNode().scrollTop + this.getDOMNode().offsetHeight
    })
  }
});

module.exports = MangaList;
