#!/usr/bin/env python3
import json
import os
import struct

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_dir = os.path.join(root, 'handshake_-_ramadhan_series')
input_gltf = os.path.join(model_dir, 'scene.gltf')

with open(input_gltf, 'r', encoding='utf-8') as f:
    gltf = json.load(f)

buffers = gltf.get('buffers', [])
if not buffers:
    raise SystemExit('No buffers found in GLTF')

buffer_uri = buffers[0].get('uri')
if not buffer_uri:
    raise SystemExit('Buffer has no uri; glTF may already be binary')

bin_path = os.path.join(model_dir, buffer_uri)
if not os.path.exists(bin_path):
    raise SystemExit(f'Binary buffer not found: {bin_path}')

with open(bin_path, 'rb') as bf:
    bin_bytes = bf.read()

# Remove uri from buffers so GLB points to binary chunk
buffers[0].pop('uri', None)

# Encode JSON chunk
json_text = json.dumps(gltf, separators=(',', ':'), ensure_ascii=False)
json_bytes = json_text.encode('utf-8')
# pad to 4 bytes
json_padding = (4 - (len(json_bytes) % 4)) % 4
json_bytes += b' ' * json_padding

# pad binary to 4 bytes
bin_padding = (4 - (len(bin_bytes) % 4)) % 4
bin_bytes_padded = bin_bytes + (b"\x00" * bin_padding)

json_chunk_len = len(json_bytes)
bin_chunk_len = len(bin_bytes_padded)

# GLB header: magic, version(2), length (placeholder)
# total length = 12 (header) + 8 + json_chunk_len + 8 + bin_chunk_len
total_length = 12 + 8 + json_chunk_len + 8 + bin_chunk_len

glb = bytearray()
glb += b'glTF'                    # magic
glb += struct.pack('<I', 2)       # version
glb += struct.pack('<I', total_length)

# JSON chunk header
glb += struct.pack('<I', json_chunk_len)
glb += b'JSON'
glb += json_bytes

# BIN chunk header
glb += struct.pack('<I', bin_chunk_len)
glb += b'BIN\x00'
glb += bin_bytes_padded

out_path = os.path.join(model_dir, 'scene.glb')
with open(out_path, 'wb') as out:
    out.write(glb)

print('Wrote', out_path, 'size', os.path.getsize(out_path))
