import React, { Component, PropTypes } from 'react';
import DocumentMeta from 'react-document-meta';
import { connect } from 'react-redux';
import * as scrapActions from 'redux/modules/scrap';
import { isLoaded, load as loadScrap } from 'redux/modules/scrap';
import connectData from 'helpers/connectData';

function fetchDataDeferred(getState, dispatch) {
  if (!isLoaded(getState())) {
    const link = getState().router.location.query.link;
    console.log(link);
    return dispatch(loadScrap(link));
  }
}

@connectData(null, fetchDataDeferred)
@connect(
  state => ({
    scrap: state.scrap.data.data, // FIXME
    error: state.scrap.error,
    title: state.scrap.data.title, // FIXME
    loading: state.scrap.loading
  }),
  {...scrapActions })
export default
class Scrap extends Component {
  static propTypes = {
    title: PropTypes.string,
    scrap: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    load: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  }

  render() {
    const { title, scrap, error, loading, load } = this.props;
    const link = this.props.location.query.link;

    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }
    const styles = require('./Scrap.scss');
    return (
      <div className={styles.scrap + ' container'}>
        <button className={styles.refreshBtn + ' btn btn-success'} onClick={() => load(link)}><i
          className={refreshClassName}/> {' '} Reload Scrap
        </button>
        <DocumentMeta title={title}/>
        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          {' '}
          {error}
        </div>}
        {scrap && scrap.length &&
        <table className="table table-striped">
          <thead>
          <tr>
            <th className={styles.idCol}>ID</th>
            <th className={styles.colorCol}>Color</th>
            <th className={styles.sprocketsCol}>Sprockets</th>
            <th className={styles.ownerCol}>Owner</th>
            <th className={styles.buttonCol}></th>
          </tr>
          </thead>
          <tbody>
          {
            scrap.map((li) =>
              <tr>
                <td className={styles.idCol}><img src={li.thumbnail}/></td>
                <td className={styles.colorCol}>{li.title}</td>
                <td className={styles.sprocketsCol}>{li.link}</td>
              </tr>)
          }
          </tbody>
        </table>}
      </div>
    );
  }
}

