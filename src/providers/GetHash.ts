import { Ref } from 'vue';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

// Function to compute the hash of a directory
export async function computeHash(
  directoryPath: string,
  ref?: Ref | null,
  count = 0,
  total = 0
): Promise<{ hash: string; count: number }> {
  const hash = crypto.createHash('sha256');
  const files = await readdir(directoryPath);
  if (count === 0) total = await countFiles(directoryPath);

  for (const file of files.sort()) {
    const filePath = path.join(directoryPath, file);
    const stats = await stat(filePath);

    if (stats.isFile()) {
      const data = await readFile(filePath);
      hash.update(data);
      count++;
    } else if (stats.isDirectory()) {
      const subDirHash = await computeHash(filePath, ref, count, total);
      count = subDirHash.count;
      hash.update(subDirHash.hash);
    }

    if (ref) {
      ref.value.extractProgress = count / total;
      const percent = (count / total) * 100;
      ref.value.extractPercent = percent;
      ref.value.extractLabel = `Validating map files: ${percent.toFixed(
        1
      )}% (${count}/${total} files)`;
    }
  }

  return { hash: hash.digest('hex'), count };
}

export async function validateDirectoryHash(
  directoryPath: string,
  expectedHash: string
): Promise<boolean> {
  const hash = await computeHash(directoryPath);
  return hash.hash === expectedHash;
}

export async function countFiles(directoryPath: string): Promise<number> {
  const files = await readdir(directoryPath);
  let count = 0;

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = await stat(filePath);

    if (stats.isFile()) {
      count++;
    } else if (stats.isDirectory()) {
      count += await countFiles(filePath);
    }
  }

  return count;
}
