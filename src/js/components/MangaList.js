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
        <a href={link} onClick={this._load}>
          <img src={imgSrc} />
          <h3 className="title">{this.props.data.title}</h3>
        </a>
      </li>
    );
  },

  _load: function () {
    var url = this.getDOMNode().children[0].href;
    this.props.load(url);
    return false;
  }
});

var MangaList = React.createClass({
  render: function () {
    var mangaNodes = this.props.data.filter(function (manga) {
      return manga.title.toLowerCase().indexOf(this.props.keyword.toLowerCase()) >= 0;
    }.bind(this))
    .map(function (manga, idx) {
      return <MangaNode key={idx} data={manga} load={this.props.load}/>
    }.bind(this));

    return (
      <div className="listview">
        <ul>
          {mangaNodes}
        </ul>
      </div>
    );
  }
});

module.exports = MangaList;
