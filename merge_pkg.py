import json

with open('wondersofrome/wondersofrome/package.json', 'r') as f:
    target = json.load(f)

with open('ticketsinrome-copy/tickets_in_rome/package.json', 'r') as f:
    source = json.load(f)

# Merge dependencies
target_deps = target.get('dependencies', {})
source_deps = source.get('dependencies', {})

for dep, version in source_deps.items():
    if dep not in target_deps:
        target_deps[dep] = version
    else:
        # If already exists, maybe keep the higher version or the source one?
        # New UI might depend on specific versions of Radix etc.
        if dep.startswith('@radix-ui'):
            target_deps[dep] = version

target['dependencies'] = dict(sorted(target_deps.items()))

# Merge devDependencies
target_dev_deps = target.get('devDependencies', {})
source_dev_deps = source.get('devDependencies', {})

for dep, version in source_dev_deps.items():
    if dep not in target_dev_deps:
        target_dev_deps[dep] = version

target['devDependencies'] = dict(sorted(target_dev_deps.items()))

with open('wondersofrome/wondersofrome/package.json', 'w') as f:
    json.dump(target, f, indent=2)
