import React, { Component, PropTypes } from 'react';
import DocumentMeta from 'react-document-meta';
import { connect } from 'react-redux';
import * as scrapActions from 'redux/modules/scrap';
import { isLoaded, load as loadScrap } from 'redux/modules/scrap';
import { initializeWithKey } from 'redux-form';

@connect(
  state => ({
    scrap: state.scrap.data.data, // FIXME
    error: state.scrap.error,
    loading: state.scrap.loading
  }),
  {...scrapActions, initializeWithKey })
export default
class Scrap extends Component {
  static propTypes = {
    scrap: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    initializeWithKey: PropTypes.func.isRequired,
    editing: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired
  }

  static fetchDataDeferred(getState, dispatch) {
    if (!isLoaded(getState())) {
      return dispatch(loadScrap());
    }
  }

  render() {
    const {scrap, error, loading, load} = this.props;
    console.log(this.props);
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }
    const styles = require('./Scrap.scss');
    return (
      <div className={styles.scrap + ' container'}>
        <h1>
          Widgets
          <button className={styles.refreshBtn + ' btn btn-success'} onClick={() => load()}><i
            className={refreshClassName}/> {' '} Reload Scrap
          </button>
        </h1>
        <DocumentMeta title="React Redux Example: Widgets"/>
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

