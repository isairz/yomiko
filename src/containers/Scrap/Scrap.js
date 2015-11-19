import React, { Component, PropTypes } from 'react';
import DocumentMeta from 'react-document-meta';
import { connect } from 'react-redux';
import { MangaList, MangaViewer } from 'components';
import BodyStyle from 'body-style';
import * as scrapActions from 'redux/modules/scrap';
import { isLoaded, load as loadScrap } from 'redux/modules/scrap';
import connectData from 'helpers/connectData';

function fetchDataDeferred(getState, dispatch) {
  const { location } = getState().router;
  const link = location.query && location.query.link;
  if (!isLoaded(getState(), link)) {
    return dispatch(loadScrap(link));
  }
}

@connectData(null, fetchDataDeferred)
@connect(
  state => ({
    scrap: state.scrap.data,
    error: state.scrap.error,
    loading: state.scrap.loading
  }),
  {...scrapActions })
export default
class Scrap extends Component {
  static propTypes = {
    scrap: PropTypes.object,
    error: PropTypes.string,
    loading: PropTypes.bool,
    load: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  }

  render() {
    const { scrap, error, loading, load, location } = this.props;
    const link = location.query && location.query.link;

    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }

    let Child = null;
    switch (scrap && scrap.type) {
      case 'list':
        Child = <MangaList list={scrap.list} />;
        break;
      case 'manga list':
        Child = <MangaList className="mangalist" list={scrap.list} />;
        break;
      case 'manga':
        Child = <MangaViewer images={scrap.images} />;
        break;
      default:
        break;
    }

    const styles = require('./Scrap.scss');
    return (
      <div className={styles.scrap}>
        <BodyStyle style={{backgroundColor: 'black'}}/>
        {scrap && scrap.title && <DocumentMeta title={scrap.title}/>}
        <button className={styles.refreshBtn} onClick={() => load(link)}>
          <i className={refreshClassName}/> {' '}
        </button>
        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          {' '}
          {error}
        </div>}
        {Child}
      </div>
    );
  }
}
