import Request from 'request';
import GM from 'gm';

const request = Request.defaults({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
  }
});

export default function proxy(req, res) {
  const {src, width, height} = req.query;
  console.log(src);
  let stream = request(encodeURI(src))
  .on('error', () => {
    res.sendStatus(404);
  })

  if(width || height) {
    stream = GM(stream)
      .resize(width, height)
      .stream();
  }

  stream.pipe(res);

  return Promise.resolve();
}
