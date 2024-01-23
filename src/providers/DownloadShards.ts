/* eslint-disable @typescript-eslint/no-explicit-any */
const https = require('https');
const fs = require('fs');
import { ShardsBox } from 'src/components/models';
import { Ref } from 'vue';
const path = require('path');

export function downloadShards(
  url: string,
  savePath: string,
  ref: Ref<ShardsBox>
): Promise<void> {
  return new Promise((resolve) => {
    const name = savePath.split(path.sep).pop();
    const file = fs.createWriteStream(savePath);
    file.on('error', (err: any) => {
      console.error(`file error on ${name} ${url}`, err);
    });

    const options = {
      // headers: {
      //   'accept-encoding': 'gzip, deflate, br',
      // },
    };
    https.get(url, options).on('response', function (res: any) {
      // const startTime = Date.now();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let downloaded = 0;
      const contentLength = +(res.headers['content-length'] as string);
      const fileSize = contentLength ? contentLength : 1;
      const fileSizeMB = fileSize / Math.pow(1024, 2);
      ref.value.totalSize += fileSizeMB;

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

          ref.value.downloaded += chunk.length / Math.pow(1024, 2);
          ref.value.downloadProgress =
            ref.value.downloaded / ref.value.totalSize;

          const thisPercent =
            (ref.value.downloaded / ref.value.totalSize) * 100;
          if (thisPercent > ref.value.downloadPercent) {
            ref.value.downloadPercent = thisPercent;
            ref.value.downloadLabel = `Map download: ${ref.value.downloadPercent.toFixed(
              1
            )}% (${Math.floor(ref.value.downloaded)}/${Math.floor(
              ref.value.totalSize
            )}MB)`;
          }
        })
        .on('end', function () {
          file.end();
          // console.log(`File ${name} downloaded successfully to "${savePath}"`);
          resolve();
        })
        .on('error', (err: any) => {
          console.error(`download error on ${name} ${url}`, err);
        })
        .on('timeout', () => {
          console.error(`got timeout event for ${url}`);
        });
    });
  });
}
