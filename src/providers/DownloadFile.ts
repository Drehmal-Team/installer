/* eslint-disable @typescript-eslint/no-explicit-any */
const https = require('https');
const fs = require('fs');
import { Ref } from 'vue';
const path = require('path');

export function downloadFile(
  url: string,
  savePath: string,
  ref?: Ref
): Promise<void> {
  return new Promise((resolve) => {
    const name = savePath.split(path.sep).pop();
    const file = fs.createWriteStream(savePath);
    file.on('error', (err: any) => {
      console.error(`file error on ${name} ${url}`, err);
    });
    // User-Agent: github_username/project_name/1.56.0 (launcher.com)
    const options = {
      headers: {
        'User-Agent': 'Drehmal-Team/installer/1.1.2 (drehmal.net)',
        // 'accept-encoding': 'gzip, deflate, br',
      },
    };
    https.get(url, options).on('response', function (res: any) {
      if (res.statusCode > 300 && res.statusCode < 400) {
        console.log(
          `Got ${res.statusCode} for ${url}, redirecting to ${res.headers.location}`
        );
        return downloadFile(res.headers.location, savePath, ref).then(() =>
          resolve()
        );
      }
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
          // console.log(`File ${name} downloaded successfully to "${savePath"}`);
          resolve();
        })
        .on('error', (err: any) => {
          console.error(`download error on ${name} ${url}`, err);
          console.error(JSON.stringify(err));
        })
        .on('timeout', () => {
          console.error(`got timeout event for ${url}`);
        });
    });
  });
}
