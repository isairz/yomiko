import React, { Component, PropTypes } from 'react';
import DocumentMeta from 'react-document-meta';
import { connect } from 'react-redux';
import { MangaList, MangaViewer, LoadingPage } from 'components';
import { replaceState } from 'redux-router';
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
    location: state.router.location,
    scrap: state.scrap.data,
    error: state.scrap.error,
    loading: state.scrap.loading
  }),
  {replaceState})
export default
class Scrap extends Component {
  static propTypes = {
    scrap: PropTypes.object,
    error: PropTypes.string,
    loading: PropTypes.bool,
    location: PropTypes.object,
    replaceState: PropTypes.func.isRequired,
  }

  render() {
    const { scrap, error, loading, location } = this.props;
    const title = scrap && scrap.title || 'Project Yomiko';
    const styles = require('./Scrap.scss');

    let Child = null;
    if (scrap.list && scrap.list.length === 1) {
      this.props.replaceState(null, location.pathname, {link: scrap.list[0].link});
    }
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
        Child = <MangaViewer {...scrap} />;
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
