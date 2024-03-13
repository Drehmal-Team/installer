import { Ref } from 'vue';
const yauzl = require('yauzl');
const fs = require('fs');
const path = require('path');

export async function extractShards(
  zipPath: string,
  outputPath: string,
  ref: Ref
): Promise<void> {
  return new Promise((resolve, reject) => {
    const totalBytes = fs.statSync(zipPath).size;
    let extractedBytes = 0;

    yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) throw err;
      zipfile.readEntry();
      zipfile.on('entry', function (entry) {
        if (/\/$/.test(entry.fileName)) {
          // directory file names end with '/'
          zipfile.readEntry();
        } else {
          // file entry
          zipfile.openReadStream(entry, function (err, readStream) {
            if (err) throw err;
            // ensure parent directory exists
            const dir = path.join(outputPath, path.dirname(entry.fileName));
            fs.mkdir(dir, { recursive: true }, (err) => {
              if (err) throw err;
              readStream.pipe(
                fs.createWriteStream(
                  path.join(dir, path.basename(entry.fileName))
                )
              );
              readStream.on('data', (chunk: any) => {
                extractedBytes += chunk.length;
                ref.value.extracted += chunk.length / Math.pow(1024, 2);
                ref.value.extractProgress =
                  ref.value.extracted / ref.value.totalExtractSize;
                const thisPercent =
                  (ref.value.extracted / ref.value.totalExtractSize) * 100;
                if (thisPercent > ref.value.extractPercent) {
                  ref.value.extractPercent = thisPercent;
                  ref.value.extractLabel = `Map extracted: ${ref.value.extractPercent.toFixed(
                    1
                  )}% (${Math.floor(ref.value.extracted)}/${Math.floor(
                    ref.value.totalExtractSize
                  )}MB)`;
                }
              });
              readStream.on('end', function () {
                zipfile.readEntry();
              });
            });
          });
        }
      });
      zipfile.on('end', function () {
        resolve();
      });
    });
  });
}
