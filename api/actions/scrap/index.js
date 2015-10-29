import marumaru from './marumaru';
const main = require('./main.json');

export default function scrap(req) {
  const link = decodeURIComponent(req.query.link);
  if (!link) {
    return Promise.reslove(main);
  }

  return new Promise((resolve) => {
    marumaru.scrap(link, resolve);
  });
}

