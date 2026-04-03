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

        // Fix 1: mailto in backticks
        // href={`mailto:{process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}`}
        // -> href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yourdomain.com"}`}
        content = content.replace(/href={`mailto:\{([^}]+)\}`}/g, 'href={`mailto:${$1}`}');
        
        // Fix 2: tel in backticks
        content = content.replace(/href={`tel:\{([^}]+)\}`}/g, 'href={`tel:${$1}`}');

        // Fix 3: placeholder or attributes with {process.env...} inside quotes
        // placeholder="{process.env.NEXT_PUBLIC_SUPPORT_PHONE || ""} (digits only)"
        // -> placeholder={`${process.env.NEXT_PUBLIC_SUPPORT_PHONE || ""} (digits only)`}
        content = content.replace(/placeholder="\{([^}]+)\}([^"]*)"/g, 'placeholder={`${$1}$2`}');
        
        // Fix 4: site name in questions or strings
        // question: "How do I book a tour with {process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}?"
        // -> question: `How do I book a tour with ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}?`
        content = content.replace(/question: "([^"]*)\{([^}]+)\}([^"]*)"/g, 'question: `$1${$2}$3`');
        content = content.replace(/answer: "([^"]*)\{([^}]+)\}([^"]*)"/g, 'answer: `$1${$2}$3`');
        content = content.replace(/title: '([^']*)\{([^}]+)\}([^']*)'/g, "title: `$1${$2}$3` wheel-fix"); // wheel-fix to avoid re-matching
        content = content.replace(/description: '([^']*)\{([^}]+)\}([^']*)'/g, "description: `$1${$2}$3` wheel-fix");

        // Fix 5: The information provided by {process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"}
        // This is inside JSX text nodes. The previous script replaced ${...} with {...} which is actually CORRECT for JSX.
        // But if it's inside a string literal (like in Privacy Policy title metadata), it's WRONG.
        
        // Clean up the wheel-fix
        content = content.replace(/` wheel-fix/g, '`');

        // Final sanity check for most common wrong pattern in the logs:
        // placeholder={`e.g., {process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"} S.r.l.`}
        content = content.replace(/placeholder={`e\.g\., \{([^}]+)\} S\.r\.l\.`}/g, 'placeholder={`e.g., ${$1} S.r.l.`}');

        if (content !== original) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Fixed syntax in ${file}`);
        }
    });
});
