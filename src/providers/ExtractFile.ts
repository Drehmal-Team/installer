import { Ref } from 'vue';

const fs = require('fs');
const tarpack = require('tar-pack');

export function extractTargz(
  archivePath: string,
  outputPath: string,
  ref?: Ref
) {
  // tarpack.unpack(archivePath)
  fs.createReadStream(archivePath).pipe(
    tarpack.unpack(
      outputPath,
      { keepFiles: true, strip: 0 },
      function (err: any) {
        if (err) console.error(err.stack);
        else {
          if (ref) ref.value.label = 'Files successfully extracted!';
        }
      }
    )
  );
}
