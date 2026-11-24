import re, json

def check_file(fname):
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()

    # Look for __next_f.push
    matches = re.findall(r'self\.__next_f\.push\(\[(\d+),\s*("(?:[^"\\]|\\.)*")\]\)', content)
    print(f"{fname}: found {len(matches)} push calls")
    errors = 0
    for idx, (num, json_str) in enumerate(matches):
        try:
            val = json.loads(json_str)
        except Exception as e:
            print(f"Error parsing chunk {idx} ({num}) in {fname}: {e}")
            errors += 1
    if errors == 0:
        print(f"All {len(matches)} push payloads in {fname} parse as valid JSON!")
    else:
        print(f"Encountered {errors} errors in {fname}")

check_file('public/rsc-routes/home.html')
print("Done!")
