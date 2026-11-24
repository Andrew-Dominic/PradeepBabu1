import os

# 1. Patch 7533 chunk
chunk_path = 'public/_next/static/chunks/7533.f07ccf9c3cd0cd4b.js'
with open(chunk_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Replace effectiveMask calculation to always 0.0
old_mask = 'float effectiveMask = mix(1.0, lensMask, uLensActivation);'
new_mask = 'float effectiveMask = 0.0;                                '

old_alpha = 'gl_FragColor.a = mix(1.0, gl_FragColor.a, uLensActivation);'
new_alpha = 'gl_FragColor.a = gl_FragColor.a;                              '

if old_mask in code:
    code = code.replace(old_mask, new_mask)
    print("Replaced effectiveMask in 7533 chunk")
else:
    print("WARNING: old_mask not found in 7533 chunk")

if old_alpha in code:
    code = code.replace(old_alpha, new_alpha)
    print("Replaced gl_FragColor.a in 7533 chunk")
else:
    print("WARNING: old_alpha not found in 7533 chunk")

with open(chunk_path, 'w', encoding='utf-8') as f:
    f.write(code)

# 2. Create a 1x1 transparent PNG
# Valid 1x1 transparent PNG bytes:
transparent_png = bytes([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
    0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
    0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
    0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
    0x42, 0x60, 0x82
])

target_textures = [
    'public/3d-hero/textures/reflection-2.png',
    'public/3d-hero/textures/reflection-2-phone.png',
    'public/3d-hero/textures/shades-logo.png',
    'public/3d-hero/textures/shades-logo-phone.png',
    'public/3d-hero/textures/shades-reflection-1.png',
    'public/3d-hero/textures/shades-reflection-1-phone.png',
]

for t in target_textures:
    with open(t, 'wb') as fp:
        fp.write(transparent_png)
    print(f"Replaced {t} with transparent PNG")

# Replace reflection.mp4 and reflection-phone.mp4 with 0 bytes or empty dummy
for v in ['public/3d-hero/textures/reflection.mp4', 'public/3d-hero/textures/reflection-phone.mp4']:
    with open(v, 'wb') as fp:
        fp.write(b'')
    print(f"Emptied {v}")

print("Hero lens and football video removal COMPLETE!")
