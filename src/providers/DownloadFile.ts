const https = require('https');
const fs = require('fs');
import log from 'electron-log';
import { Ref } from 'vue';
const path = require('path');

function downloadFile(url: string, savePath: string, ref?: Ref): Promise<void> {
  return new Promise((resolve, reject) => {
    const name = savePath.split(path.sep).pop();
    const file = fs.createWriteStream(savePath);
    file.on('error', (err: any) => {
      log.error(`file error on ${name} ${url}`, err);
    });

    const options = {
      // headers: {
      //   'accept-encoding': 'gzip, deflate, br',
      // },
    };
    https.get(url, options).on('response', function (res: any) {
      // const startTime = Date.now();
      let downloaded = 0;
      const contentLength = +(res.headers['content-length'] as string);
      // function elapsed() {
      //   const delta = Date.now() - startTime;
      //   // convert to minutes
      //   const mins = delta / (1000 * 60);
      //   return mins;
      // }

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
          // const elapsedMins = elapsed();
          // const totalEstimateMins = (1 / downloadPortion) * elapsedMins;
          // const remainingMins = totalEstimateMins - elapsedMins;
          // const remainingSecs = remainingMins * 60;
          const fileSizeMB = fileSize / Math.pow(1024, 2);
          const downloadedMB = downloaded / Math.pow(1024, 2);

          if (ref) {
            ref.value.progress = downloadPortion;
            ref.value.percent = percent;
            ref.value.label = `Downloading: ${percent.toFixed(
              1
            )}% (${Math.floor(downloadedMB)}/${Math.floor(fileSizeMB)}MB)`;
          }
        })
        .on('end', function () {
          file.end();
          log.info(`${name} downloaded successfully`);
          resolve();
        })
        .on('error', (err: any) => {
          log.error(`download error on ${name} ${url}`, err);
        })
        .on('timeout', () => {
          log.error(`got timeout event for ${url}`);
        });
    });
  });
}

export { downloadFile };
