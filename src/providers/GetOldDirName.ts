const fs = require('fs');

export function getOldDirName(dir: string): string {
  let dirName = dir + '_OLD';
  let index = 1;

  while (true) {
    if (!fs.existsSync(dirName)) return dirName;
    else dirName = `${dir}_OLD${index++}`;
  }
}
