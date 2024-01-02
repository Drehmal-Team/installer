const https = require('https');
const fs = require('fs');
import { Ref } from 'vue';
// import path from 'path'
const path = require('path');
// async function downloadFile(shard: Shard, savePath: string) {
function downloadFile(url: string, savePath: string, ref?: Ref): Promise<void> {
  return new Promise((resolve, reject) => {
    const name = savePath.split(path.sep).pop();
    const file = fs.createWriteStream(savePath);
    file.on('error', (err: any) => {
      console.log(`file error on ${name} ${url}`, err);
    });

    const options = {
      // headers: {
      //   'accept-encoding': 'gzip, deflate, br',
      // },
    };
    https.get(url, options).on('response', function (res: any) {
      const startTime = Date.now();
      let downloaded = 0;
      const contentLength = +(res.headers['content-length'] as string);

      function elapsed() {
        const delta = Date.now() - startTime;
        // convert to minutes
        const mins = delta / (1000 * 60);
        return mins;
      }

      res.setTimeout(24 * 60 * 60 * 1000);
      res
        .on('data', function (chunk: any) {
          const readyForMore = file.write(chunk);
          if (!readyForMore) {
            res.pause();
            file.once('drain', () => {
              res.resume();
            });
          }

          downloaded += chunk.length;
          const fileSize = contentLength ? contentLength : 1;
          const downloadPortion = downloaded / fileSize;
          const percent = downloadPortion * 100;
          const elapsedMins = elapsed();
          const totalEstimateMins = (1 / downloadPortion) * elapsedMins;
          const remainingMins = totalEstimateMins - elapsedMins;
          const remainingSecs = remainingMins * 60;
          const fileSizeMB = fileSize / Math.pow(1024, 2);
          const downloadedMB = downloaded / Math.pow(1024, 2);

          // shards.value[shardIndex].progress = newProgress;
          // shards.value[shardIndex].percent = newPercent;
          if (ref) {
            ref.value.progress = downloadPortion;
            ref.value.percent = percent;
            ref.value.label = `Downloading: ${percent.toFixed(
              1
            )}% (${Math.floor(downloadedMB)}/${Math.floor(fileSizeMB)}MB)`;
          }
          // updateProgress(index, downloadPortion, percent);
        })
        .on('end', function () {
          file.end();
          console.log(`${name} downloaded successfully. ${Date.now()}`);
          resolve();
        })
        .on('error', (err: any) => {
          console.log(`download error on ${name} ${url}`, err);
        })
        .on('timeout', () => {
          console.log('got timeout event');
        });
    });
  });
}

export { downloadFile };
// const downloadfile = 'http://nodejs.org/dist/node-v0.2.6.tar.gz';

// const host = url.parse(downloadfile).hostname
// const filename = url.parse(downloadfile).pathname.split('/').pop()

// const theurl = http.createClient(80, host);
// const requestUrl = downloadfile;
// sys.puts('Downloading file: ' + filename);
// sys.puts('Before download request');
// const request = theurl.request('GET', requestUrl, {'host': host});
// request.end();

// let dlprogress = 0;

// setInterval(function () {
//    sys.puts('Download progress: ' + dlprogress + ' bytes');
// }, 1000);

// request.addListener('response', function (response) {
//   const downloadfile = fs.createWriteStream(filename, {'flags': 'a'});
//   sys.puts('File size ' + filename + ': ' + response.headers['content-length'] + ' bytes.');
//   response.addListener('data', function (chunk) {
//       dlprogress += chunk.length;
//       downloadfile.write(chunk, encoding='binary');
//   });
//   response.addListener('end', function() {
//       downloadfile.end();
//       sys.puts('Finished downloading ' + filename);
//   });

// });
