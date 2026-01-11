const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const modelDir = path.join(root, 'handshake_-_ramadhan_series');
const inputGltf = path.join(modelDir, 'scene.gltf');

if (!fs.existsSync(inputGltf)) {
  console.error('scene.gltf not found at', inputGltf);
  process.exit(1);
}

const gltf = JSON.parse(fs.readFileSync(inputGltf, 'utf8'));
const buffers = gltf.buffers || [];
if (!buffers.length) { console.error('No buffers'); process.exit(1); }
const bufferUri = buffers[0].uri;
if (!bufferUri) { console.error('No buffer uri'); process.exit(1); }
const binPath = path.join(modelDir, bufferUri);
if (!fs.existsSync(binPath)) { console.error('Binary buffer not found:', binPath); process.exit(1); }
const binBytes = fs.readFileSync(binPath);

// remove uri
delete buffers[0].uri;

let jsonText = JSON.stringify(gltf);
let jsonBytes = Buffer.from(jsonText, 'utf8');
const jsonPad = (4 - (jsonBytes.length % 4)) % 4;
if (jsonPad) jsonBytes = Buffer.concat([jsonBytes, Buffer.alloc(jsonPad, 0x20)]);

const binPad = (4 - (binBytes.length % 4)) % 4;
let binBytesPadded = binBytes;
if (binPad) binBytesPadded = Buffer.concat([binBytes, Buffer.alloc(binPad, 0x00)]);

const jsonChunkLength = jsonBytes.length;
const binChunkLength = binBytesPadded.length;
const totalLength = 12 + 8 + jsonChunkLength + 8 + binChunkLength;

const header = Buffer.alloc(12);
header.write('glTF', 0, 4, 'ascii');
header.writeUInt32LE(2, 4);
header.writeUInt32LE(totalLength, 8);

const jsonHeader = Buffer.alloc(8);
jsonHeader.writeUInt32LE(jsonChunkLength, 0);
jsonHeader.write('JSON', 4, 4, 'ascii');

const binHeader = Buffer.alloc(8);
binHeader.writeUInt32LE(binChunkLength, 0);
binHeader.write('BIN\x00', 4, 4, 'ascii');

const outPath = path.join(modelDir, 'scene.glb');
const out = Buffer.concat([header, jsonHeader, jsonBytes, binHeader, binBytesPadded]);
fs.writeFileSync(outPath, out);
console.log('Wrote', outPath, out.length);
