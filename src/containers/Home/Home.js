import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Home extends Component {
  render() {
    const styles = require('./Home.scss');
    // require the logo image both from client and server
    return (
      <div className={styles.home}>
        <div className={styles.masthead}>
          <div className="container">
            <Link to="/scrap">
              <div className={styles.logo}/>
            </Link>
            <h1>Yomiko</h1>

            <h2>Who is beloved by paper(kami)</h2>
          </div>
        </div>

        <div className="container">
          <h3>어디에 쓰는 것 인가요?</h3>

          <dl>
            <dt>편리한 UI</dt>
            <dd>
              인터넷의 만화들을 보기 쉽게 쓰기 위한 것입니다.
            </dd>
          </dl>

          <h3>From the author</h3>

          <p>

          </p>

          <p>Thanks for taking the time to check this out.</p>

          <p>– Previous</p>
        </div>
      </div>
    );
  }
}
