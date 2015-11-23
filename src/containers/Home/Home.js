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
          <h3>요미코는?</h3>

          <dl>
            <dt>만화 뷰어</dt>
            <dd>
              간단히 말해서 편리한 만화뷰어에요.
            </dd>
            <dt>사용법</dt>
            <dd>
              위의 요미코 아이콘을 누르고 사용해요.
            </dd>
            <dd>
              모바일 크롬의 경우 [메뉴 - 홈 화면에 추가] 를 해두시면 편리해요.
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
