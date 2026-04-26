const fs = require('fs');
const path = require('path');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // 1. Remove old auth scripts if they exist
    content = content.replace(/<script type="module">[\s\S]*?import { auth, onAuthStateChanged, checkIsAdmin, signOut } from ".\/auth.js";[\s\S]*?<\/script>/g, '');
    
    // 2. Add the new update_layout link before </body>
    if (!content.includes('update_layout.js')) {
        content = content.replace('</body>', '<script src="update_layout.js" type="module"></script>\n</body>');
    }
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
});
