import Request from 'request';

const request = Request.defaults({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
  }
});

export default function proxy(req, res) {
  request(encodeURI(req.query.src))
  .on('error', () => {
    res.sendStatus(404);
  })
  .pipe(res);

  return Promise.resolve();
}
