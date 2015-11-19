import React, {Component, PropTypes} from 'react';

export default class BackgroundImage extends Component {

  static propTypes = {
    lazy: PropTypes.bool,
    proxy: PropTypes.bool,
    src: PropTypes.string,
    className: PropTypes.string,
  }

  static defaultProps = {
    lazy: false,
    proxy: false,
    src: '',
    className: '',
  }

  constructor(props) {
    super(props);
    this.state = {load: !props.lazy};
  }

  load(sw: boolean) {
    this.setState({load: sw});
  }

  render() {
    const {src, proxy, className} = this.props;
    const load = this.state.load || !this.props.lazy;
    let url = '';
    if (src && load) {
      if (proxy) url = `/api/imageProxy/?src=${encodeURIComponent(src)}`;
      else url = src;
    }
    return <div className={className} style={{backgroundImage: `url(${url})`}}></div>;
  }
}
