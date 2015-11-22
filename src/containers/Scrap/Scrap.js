import React, { Component, PropTypes } from 'react';
import DocumentMeta from 'react-document-meta';
import { connect } from 'react-redux';
import { MangaList, MangaViewer, LoadingPage } from 'components';
import { isLoaded, load } from 'redux/modules/scrap';
import connectData from 'helpers/connectData';

function fetchDataDeferred(getState, dispatch) {
  const { location } = getState().router;
  const link = location.query && location.query.link;
  if (!isLoaded(getState(), link)) {
    return dispatch(load(link));
  }
}

@connectData(null, fetchDataDeferred)
@connect(
  state => ({
    scrap: state.scrap.data,
    error: state.scrap.error,
    loading: state.scrap.loading
  }),
  {})
export default
class Scrap extends Component {
  static propTypes = {
    scrap: PropTypes.object,
    error: PropTypes.string,
    loading: PropTypes.bool,
  }

  render() {
    const { scrap, error, loading } = this.props;
    const title = scrap && scrap.title || 'Project Yomiko';
    const styles = require('./Scrap.scss');

    let Child = null;
    switch (scrap && scrap.type) {
      case 'list':
        Child = (
          <div className={styles.content}>
            <MangaList title={title} list={scrap.list} />
          </div>
        );
        break;
      case 'manga list':
        Child = (
          <div className={styles.content}>
            <MangaList className="mangalist" title={title} list={scrap.list} />
          </div>
        );
        break;
      case 'manga':
        Child = <MangaViewer images={scrap.images} />;
        break;
      default:
        break;
    }

    return (
      <div className={styles.scrap}>
        {title && <DocumentMeta title={title}/>}
        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          {' '}
          {error}
        </div>}
        {loading && <LoadingPage />}
        {!loading && Child}
      </div>
    );
  }
}
