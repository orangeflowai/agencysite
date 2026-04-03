const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file === 'node_modules' || file === '.next' || file === '.git') return;
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('/route.ts')) {
            results.push(file);
        }
    });
    return results;
}

const folders = ['romewander', 'romanvaticantour', 'romewebsite'];

folders.forEach(folder => {
    const apiDir = path.join(__dirname, folder, 'src/app/api');
    const files = walk(apiDir);

    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let original = content;

        // Fix 1: mailto: in strings
        // href={`mailto:${...}`} -> href="mailto:${...}"
        content = content.replace(/href={`mailto:\$\{([^}]+)\}`}/g, 'href="mailto:${$1}"');
        
        // Fix 2: site url in strings
        // {process.env.NEXT_PUBLIC_SITE_URL || ""} -> ${process.env.NEXT_PUBLIC_SITE_URL || ""}
        // (but only inside backticks)
        // Find backticks content
        content = content.replace(/(`[^`]*`)/g, (match) => {
            return match.replace(/\{process\.env\.([^}]+)\}/g, '${process.env.$1}');
        });

        // Fix 3: Link text
        // }>{process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}</a>
        // -> }>${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}</a>
        // (This is covered by Fix 2)

        if (content !== original) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Fixed API route: ${file}`);
        }
    });
});
