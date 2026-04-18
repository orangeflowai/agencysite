with open('romanvaticantour/src/sanity/structure.ts') as f:
    lines = f.readlines()

fixed = []
for line in lines:
    # Replace template literals containing double-quoted fallbacks
    # e.g. .title(`Settings for ${process.env.X || "Your Agency"}`)
    # → .title('Settings')
    if '.title(`' in line and '|| "' in line and '`)' in line:
        # Extract the fallback string between the last || " and "
        import re
        m = re.search(r'\|\|\s*"([^"]+)"', line)
        if m:
            fallback = m.group(1)
            # Replace the whole .title(`...`) with .title('fallback')
            line = re.sub(r'\.title\(`[^`]+`\)', f".title('{fallback}')", line)
    fixed.append(line)

with open('romanvaticantour/src/sanity/structure.ts', 'w') as f:
    f.writelines(fixed)

print('Done. Fixed lines:')
for i, (old, new) in enumerate(zip(lines, fixed)):
    if old != new:
        print(f'  Line {i+1}: {new.strip()}')
