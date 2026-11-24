import os
import glob

files = glob.glob('public/rsc-routes/*.*')
for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    if 'featuredRecognition' in c:
        print(f"Fixing {f}: replacing featuredRecognition with featuredPartnerships")
        # In JSON and RSC props, it's "featuredRecognition" -> "featuredPartnerships"
        c_fixed = c.replace('"featuredRecognition"', '"featuredPartnerships"')
        c_fixed = c_fixed.replace('featuredRecognition', 'featuredPartnerships')
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(c_fixed)

print("Done checking rsc-routes")
