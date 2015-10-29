import Request from 'request';
import archiver from 'archiver';
import path from 'path';
import scrap from './scrap';

const request = Request.defaults({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
  }
});

function padZeros(idx, len) {
  let str = idx.toString();
  for (let it = str.length; it < len; it++) {
    str = '0' + str;
  }
  return str;
}

function escapeName(str) {
  return str
    .replace(/</g, '〈')
    .replace(/>/g, '〉')
    .replace(/\?/g, '？')
    .replace(/!/g, '！')
    .replace(/\"/g, '＂')
    .replace(/\'/g, '＇')
    .replace(/\*/g, '＊')
    .replace(/:/g, '：')
    .replace(/\//g, '／')
    .replace(/\\/g, '＼');
}

export default function download(req, res, params) {
  scrap(req, res, params)
  .then(episode => {
  	// TODO: check type of episode
    const archive = archiver('zip');
    const images = episode.images;
    const pageLength = images.length.toString().length;
    const title = escapeName(episode.title || 'Untitled') + '.zip';
    console.log(title);

    images.forEach((url, idx) => {
      const imageStream = request({url: encodeURI(url), encoding: null})
        .on('error', err => {
          archive.abort();
          archive.emit('error', err);
        });
      archive.append(imageStream, {
        name: padZeros(-~idx, pageLength) + path.extname(url).split('?')[0]
      });
    });
    archive.finalize();

    res
    .attachment(title)
    .on('close', () => {
      res.end();
    });

    archive
    .on('error', () => {
      // TODO: Error Handle
      res.end();
    })
    .pipe(res);
  });

  return Promise.resolve();
}

