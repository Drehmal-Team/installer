const fs = require('fs');

const imgPaths = [];

const out = [];
imgPaths.forEach((img) => {
  const base64 = base64_encode(img);
  out.push('data:image/png;base64,' + base64);
});
console.log(JSON.stringify(out));

function base64_encode(file) {
  const bitmap = fs.readFileSync(file);
  return new Buffer(bitmap).toString('base64');
}
