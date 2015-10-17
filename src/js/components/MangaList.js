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
        <a ref='link' href={'/?link=' + encodeURIComponent(link)} rawurl={link} onClick={this._onClick}>
          <div className='thumbnail' style={{backgroundImage:(this.props.hidden ? 'url()' : 'url('+imgSrc+')')}} />
          <h3 className="title">{this.props.data.title}</h3>
        </a>
      </li>
    );
  },

  _onClick: function (e) {
    if (e.ctrlKey || e.altKey || e.shiftKey) {
      return;
    }
    var url = this.refs.link.props.rawurl;
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
      lastElement: 40,
      nodePerColumn: 1,
      heightPerNode: 112
    };
  },

  componentDidMount: function () {
    window.addEventListener('scroll', this._onScroll, this, false);
    this._onScroll();

    var container = this.refs.container.getDOMNode();
    var node = container.querySelector('li');
    var containerWidth = container.getClientRects()[0].width;
    var nodeWidth = node.getBoundingClientRect().width;
    var nodeHeight = node.getBoundingClientRect().height;
    this.setState({
      nodePerColumn: Math.floor(containerWidth / nodeWidth),
      heightPerNode: nodeHeight,
    })
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
      <div className={'listview ' + this.props.className}>
        <div className="header">
          <input ref="search" className="search" placeholder="search title" onInput={this._onSearch} />
        </div>
        <ul ref="container">
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
    var c = this.state.nodePerColumn;
    var firstElement = Math.floor(top/this.state.heightPerNode) * c;
    var lastElement = Math.floor(bottom/this.state.heightPerNode) * c;

    if (firstElement < this.state.firstElement || lastElement > this.state.lastElement) {
      this.setState({
        firstElement: firstElement-5*c,
        lastElement: lastElement+5*c
      });
    }
  }
});

module.exports = MangaList;
