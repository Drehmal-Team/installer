const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Function to compute the hash of a directory
async function computeHash(directoryPath) {
  const hash = crypto.createHash('sha256');
  const files = fs.readdirSync(directoryPath).sort();

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      const data = fs.readFileSync(filePath);
      hash.update(data);
    } else if (stat.isDirectory()) {
      const subDirHash = await computeHash(filePath);
      hash.update(subDirHash);
    }
  }

  return hash.digest('hex');
}

computeHash(path.join('Drehmal 2.2 Apotheosis Beta 1.1.0')).then((h) =>
  console.log(h)
);
