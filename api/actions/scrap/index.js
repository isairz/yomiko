import marumaru from './marumaru';
const main = require('./main.json');

export default function scrap(req) {
  const link = req.query.link;
  if (!link) {
    return Promise.resolve(main);
  }

  return new Promise((resolve) => {
    marumaru.scrap(link, resolve);
  });
}

