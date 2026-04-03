const fs = require('fs');
const path = require('path');

const folders = ['romewander', 'romanvaticantour', 'romewebsite'];

folders.forEach(folder => {
    const filePath = path.join(__dirname, folder, 'src/lib/email-templates.ts');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Fix isWonders missing variable
    if (!content.includes('const isWonders')) {
        content = content.replace('const brandColor =', 'const isWonders = siteId === "wondersofrome";\n  const brandColor =');
    }

    // 2. Fix logoUrl syntax error
    // logoUrl = `{process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/logo.png`
    content = content.replace(/\{process\.env\.NEXT_PUBLIC_SITE_URL \|\| '([^']+)'\}/, '${process.env.NEXT_PUBLIC_SITE_URL || "$1"}');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${filePath}`);
});
