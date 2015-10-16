var React = require('react');

var MangaNode = React.createClass({
  render: function () {
    var imgSrc = this.props.data.thumbnail || '';
    if (imgSrc.indexOf('marumaru.in/') >= 0) {
      imgSrc = '/image-proxy?src=' + imgSrc;
    } else if (imgSrc.indexOf('i.imgur.com/') >= 0) {
      // use thumbnail.
      imgSrc = imgSrc.replace(/(\.\w+)$/, 's$1');
    }
    var link = this.props.data.link;

    return (
      <li className="manga">
        <a ref='link' href={link} onClick={this._onClick}>
          <div className={(this.props.hidden ? 'hidden_elem' : '') + ' thumbnail'} style={{backgroundImage:'url('+imgSrc+')'}} />
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
    return {
      keyword: '',
      firstElement: 0,
      lastElement: 10,
      heightPerNode: 112
    };
  },

  componentDidMount: function () {
    window.addEventListener('scroll', this._onScroll, this, false);
    this._onScroll();
  },

  componentWillUnmount: function () {
    window.removeEventListener('scroll', this._onScroll, this, false);
  },

  componentWillUpdate: function (nextProps, nextState) {
    if (nextProps.data !== this.props.data) {
      this.refs.search.getDOMNode().value = '';
      nextState.keyword = '';
    }
  },

  render: function () {
    var mangaNodes = this.props.data.filter(function (manga) {
      return manga.title.toLowerCase().indexOf(this.state.keyword.toLowerCase()) >= 0;
    }.bind(this))
    .map(function (manga, idx) {
      return <MangaNode hidden={idx < this.state.firstElement || idx > this.state.lastElement} data={manga} load={this.props.load} />
    }.bind(this));

    return (
      <div className="listview">
        <div className="header">
          <input ref="search" className="search" placeholder="search title" onInput={this._onSearch} />
        </div>
        <ul>
          {mangaNodes}
        </ul>
      </div>
    );
  },

  _onSearch: function () {
    var keyword = this.refs.search.getDOMNode().value;
    this.setState({
      keyword: keyword
    });
  },

  _onScroll: function(e) {
    var top = window.scrollY;
    var bottom = top + window.innerHeight;
    var firstElement = Math.floor(top/this.state.heightPerNode);
    var lastElement = Math.floor(bottom/this.state.heightPerNode);

    if (firstElement < this.state.firstElement || lastElement > this.state.lastElement) {
      this.setState({
        firstElement: firstElement-5,
        lastElement: lastElement+5
      });
    }
  }
});

module.exports = MangaList;
