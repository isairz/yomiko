import React from 'react';

const styles = require('./LoadingPage.scss');

const Spinner = (props) => {
  const bars = [];

  for (let idx = 0; idx < 12; idx++) {
    const barStyle = {};
    barStyle.WebkitAnimationDelay = barStyle.animationDelay =
      (idx - 12) / 10 + 's';

    barStyle.WebkitTransform = barStyle.transform =
      'rotate(' + (idx * 30) + 'deg) translate(146%)';

    bars.push(
      <div style={barStyle} className={styles.react_spinner_bar} key={idx}/>
    );
  }

  console.log(styles);

  return (
    <div {...props} className={styles.react_spinner}>
      {bars}
    </div>
  );
};

const LoadingPage = () => {
  return (
    <Spinner className={styles.react_spinner}/>
  );
};
export default LoadingPage;
