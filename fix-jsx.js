const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file === 'node_modules' || file === '.next') return;
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const folders = ['romewander', 'romanvaticantour', 'romewebsite'];

folders.forEach(folder => {
    const srcDir = path.join(__dirname, folder, 'src');
    const files = walk(srcDir);

    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let original = content;

        // Fix href="mailto:${...}" -> href={`mailto:${...}`}
        content = content.replace(/href="mailto:\$\{([^}]+)\}"/g, 'href={`mailto:${$1}`}');
        
        // Fix href="tel:${...}" -> href={`tel:${...}`}
        content = content.replace(/href="tel:\$\{([^}]+)\}"/g, 'href={`tel:${$1}`}');

        // Fix href="https://wa.me/${...}" -> href={`https://wa.me/${...}`}
        content = content.replace(/href="https:\/\/wa\.me\/\$\{([^}]+)\}"/g, 'href={`https://wa.me/${$1}`}');

        // Fix placeholder="e.g., ${...} S.r.l."
        content = content.replace(/placeholder="e\.g\., \$\{([^}]+)\} S\.r\.l\."/g, 'placeholder={`e.g., ${$1} S.r.l.`}');

        // Fix plain text ${...} inside React elements (e.g., The information provided by ${process.env...})
        // Not inside quotes
        // We can just find {process.env...} but wait, they wrote ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"} directly in text.
        // Let's replace raw text ${process.env...} with {process.env...}
        content = content.replace(/\$\{process\.env\.([^}]+)\}/g, '{process.env.$1}');

        // Fix href="${...}"
        content = content.replace(/href="\{([^}]+)\}"/g, 'href={$1}');

        if (content !== original) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Fixed syntax in ${file}`);
        }
    });

    // Remove seed-verified
    const seedDir = path.join(__dirname, folder, 'src/app/api/seed-verified');
    if (fs.existsSync(seedDir)) {
        fs.rmSync(seedDir, { recursive: true, force: true });
        console.log(`Deleted ${seedDir}`);
    }
});
