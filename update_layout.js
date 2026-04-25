const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !['admin.html'].includes(f));

// Navigation items
const navItems = [
    { name: 'Home', href: 'index.html' },
    { name: 'PYQs', href: 'pyq.html' },
    { name: 'Materials', href: 'materials.html' },
    { name: 'Daily Hub', href: 'daily.html' },
    { name: 'AI Analyzer', href: 'ai.html' },
    { name: 'Doubts', href: 'doubts.html' },
    { name: 'CGPA', href: 'cgpa.html' },
    { name: 'Library', href: 'library.html' },
    { name: 'Alumni', href: 'alumni.html' },
    { name: 'Admin Portal', href: 'admin.html', isAdmin: true }
];

function generateNavLinks(currentFile, isMobile = false) {
    return navItems.map(item => {
        const isActive = item.href === currentFile;
        const isAdminLink = item.isAdmin === true;
        const baseClass = isMobile 
            ? "block px-4 py-3 rounded-lg font-medium transition"
            : "block px-4 py-3 rounded-xl transition";
        
        let activeClass = isActive 
            ? (isMobile ? "text-white bg-white/5" : "text-white font-medium bg-white/5")
            : "text-slate-300 hover:bg-white/5 hover:text-white";

        if (isAdminLink && !isActive) {
            activeClass = "text-primary/80 hover:bg-primary/10 hover:text-primary";
        }
            
        const icon = isAdminLink ? '<i class="fa-solid fa-shield-halved mr-3"></i>' : '';
        const idAttr = isAdminLink ? 'id="nav-admin-link"' : '';
        const hiddenClass = isAdminLink ? 'hidden' : '';
        
        return `<a href="${item.href}" ${idAttr} class="${baseClass} ${activeClass} ${hiddenClass}">${icon}${item.name}</a>`;
    }).join('\n            ');
}

const authLogicScript = `
    <script type="module">
        import { auth, onAuthStateChanged, checkIsAdmin, signOut } from "./js/auth.js";
        
        onAuthStateChanged(auth, async (user) => {
            const adminLinks = document.querySelectorAll('#nav-admin-link');
            const adminOnlyElements = document.querySelectorAll('.admin-only');
            const userProfile = document.querySelectorAll('.user-profile-section');
            const guestLinks = document.querySelectorAll('.guest-only');
            
            if (user) {
                const isAdmin = await checkIsAdmin(user.email);
                adminLinks.forEach(link => {
                    if (isAdmin) link.classList.remove('hidden');
                    else link.classList.add('hidden');
                });
                adminOnlyElements.forEach(el => {
                    if (isAdmin) el.classList.remove('hidden');
                    else el.classList.add('hidden');
                });
                
                userProfile.forEach(el => el.classList.remove('hidden'));
                guestLinks.forEach(el => el.classList.add('hidden'));
                
                const userNameEl = document.getElementById('user-name-display');
                if (userNameEl) userNameEl.textContent = user.displayName || user.email.split('@')[0];
            } else {
                adminLinks.forEach(link => link.classList.add('hidden'));
                adminOnlyElements.forEach(el => el.classList.add('hidden'));
                userProfile.forEach(el => el.classList.add('hidden'));
                guestLinks.forEach(el => el.classList.remove('hidden'));
            }
        });

        window.handleLogout = async () => {
            await signOut(auth);
            window.location.reload();
        };
    </script>`;

const logoHtml = (isLarge = false) => `
            <div class="flex items-center gap-3">
                <img src="logo.jpg" alt="EduSUT Logo" class="${isLarge ? 'w-14 h-14' : 'w-10 h-10'} rounded-full object-cover border border-white/10 shadow-lg shadow-primary/20">
                <div>
                    <h1 class="${isLarge ? 'text-2xl' : 'text-xl'} font-bold text-primary tracking-tight leading-none mb-0.5">EduSUT</h1>
                    <p class="text-[10px] text-slate-400">VSSUT Smart Learning Platform</p>
                </div>
            </div>`;

const sidebarProfileHtml = `
        <div class="mt-auto p-4 border-t border-white/5">
            <div class="guest-only">
                <a href="login.html" class="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primaryHover text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
                    <i class="fa-solid fa-right-to-bracket"></i> Login / Sign In
                </a>
            </div>
            <div class="user-profile-section hidden">
                <div class="flex items-center gap-3 p-2 mb-2">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg">
                        <i class="fa-solid fa-user text-sm"></i>
                    </div>
                    <div class="overflow-hidden">
                        <p id="user-name-display" class="text-sm font-bold text-white truncate">Student</p>
                        <p class="text-[10px] text-slate-500 truncate">VSSUT Portal</p>
                    </div>
                </div>
                <button onclick="handleLogout()" class="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-400 py-2.5 rounded-xl text-sm font-medium transition-all">
                    <i class="fa-solid fa-right-from-bracket"></i> Logout
                </button>
            </div>
        </div>`;

for (const file of htmlFiles) {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // For index.html
    if (file === 'index.html') {
        // Strip existing sidebars and re-inject to avoid duplicates
        content = content.replace(/<body[^>]*>([\s\S]*?)<\/body>/i, (match, bodyContent) => {
            // Remove any existing sidebar or header from bodyContent to clean up
            let cleanBody = bodyContent.replace(/<div class="md:hidden flex items-center justify-between p-4 bg-sidebar[\s\S]*?<\/div>\s*<div id="mobile-sidebar"[\s\S]*?<\/div>/i, '');
            cleanBody = cleanBody.replace(/<aside[\s\S]*?<\/aside>/i, '');
            
            // Extract the actual main content (anything that's not a sidebar/header)
            // In index.html, it's usually inside <main>
            let mainMatch = cleanBody.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
            let mainContent = mainMatch ? mainMatch[0] : cleanBody;

            return `<body class="bg-mainBg text-slate-300 font-sans h-screen overflow-hidden flex flex-col md:flex-row selection:bg-primary selection:text-white">
    <!-- Mobile Header -->
    <div class="md:hidden flex items-center justify-between p-4 bg-sidebar border-b border-white/5 z-20 relative">
        ${logoHtml(false)}
        <button onclick="document.getElementById('mobile-sidebar').classList.toggle('hidden')" class="text-slate-300 hover:text-white focus:outline-none p-2">
            <i class="fa-solid fa-bars text-xl"></i>
        </button>
    </div>

    <!-- Mobile Sidebar -->
    <div id="mobile-sidebar" class="hidden md:hidden fixed inset-0 z-30 pt-16 bg-sidebar/95 backdrop-blur-sm border-b border-white/5">
        <nav class="px-4 py-6 space-y-2 overflow-y-auto h-full pb-20">
            ${generateNavLinks('index.html', true)}
        </nav>
        ${sidebarProfileHtml}
    </div>

    <!-- Desktop Sidebar -->
    <aside class="w-[280px] bg-sidebar border-r border-white/5 hidden md:flex flex-col z-10 relative">
        <div class="p-8 pb-4 cursor-pointer" onclick="window.location.href='index.html'">
            ${logoHtml(true)}
        </div>
        <nav class="flex-1 px-5 mt-6 space-y-1 overflow-y-auto">
            ${generateNavLinks('index.html', false)}
        </nav>
        ${sidebarProfileHtml}
    </aside>

    ${mainContent}
    ${authLogicScript}
    <script src="js/app.js"></script>
</body>`;
        });

        fs.writeFileSync(path.join(dir, file), content);
        continue;
    }

    // Process other files using the general template
    let extractedContent = "";
    let sectionMatch = content.match(/<section[^>]*class="[^"]*page-section[^"]*"[^>]*>([\s\S]*?)<\/section>/);
    if (sectionMatch) {
        extractedContent = sectionMatch[0];
    } else {
        let mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/);
        if (mainMatch) {
            extractedContent = mainMatch[1].trim();
        } else {
            let anySectionMatch = content.match(/<section[^>]*>([\s\S]*?)<\/section>/);
            extractedContent = anySectionMatch ? anySectionMatch[0] : "";
        }
    }

    if (!extractedContent) continue;

    let extraScripts = "";
    if (file === 'materials.html') {
        extraScripts = `<script src="js/materials-logic.js"></script>`;
    } else if (file === 'ai.html') {
        extraScripts = `<script src="js/ai-analyzer.js"></script>`;
    } else if (file === 'login.html' || file === 'signup.html') {
        extraScripts = `<script type="module" src="js/login-logic.js"></script>`;
    }

    const newTemplate = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduSUT - ${file.replace('.html', '').toUpperCase()}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'sans-serif'], display: ['Space Grotesk', 'sans-serif'] },
                    colors: { sidebar: '#080c16', mainBg: '#0f1423', cardBg: '#151b2b', primary: '#6366f1', primaryHover: '#4f46e5', accent: '#8b5cf6', darkBg: '#0a0a0f', glassBg: 'rgba(255, 255, 255, 0.05)', glassBorder: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="css/styles.css">
    <style>
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0f1423; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
        .subject-card { background: #151b2b; border: 1px solid rgba(255, 255, 255, 0.05); transition: all 0.3s ease; }
        .subject-card:hover { transform: translateY(-5px); border-color: #6366f1; box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.2); }
    </style>
</head>
<body class="bg-mainBg text-slate-300 font-sans h-screen overflow-hidden flex flex-col md:flex-row selection:bg-primary selection:text-white">

    <!-- Mobile Header -->
    <div class="md:hidden flex items-center justify-between p-4 bg-sidebar border-b border-white/5 z-20 relative">
        ${logoHtml(false)}
        <button onclick="document.getElementById('mobile-sidebar').classList.toggle('hidden')" class="text-slate-300 hover:text-white focus:outline-none p-2">
            <i class="fa-solid fa-bars text-xl"></i>
        </button>
    </div>

    <!-- Mobile Sidebar -->
    <div id="mobile-sidebar" class="hidden md:hidden fixed inset-0 z-30 pt-16 bg-sidebar/95 backdrop-blur-sm border-b border-white/5">
        <nav class="px-4 py-6 space-y-2 overflow-y-auto h-full pb-20">
            ${generateNavLinks(file, true)}
        </nav>
        ${sidebarProfileHtml}
    </div>

    <!-- Desktop Sidebar -->
    <aside class="w-[280px] bg-sidebar border-r border-white/5 hidden md:flex flex-col z-10 relative">
        <div class="p-8 pb-4 cursor-pointer" onclick="window.location.href='index.html'">
            ${logoHtml(true)}
        </div>
        <nav class="flex-1 px-5 mt-6 space-y-1 overflow-y-auto">
            ${generateNavLinks(file, false)}
        </nav>
        ${sidebarProfileHtml}
    </aside>

    <main class="flex-1 overflow-y-auto relative z-0 p-6 md:p-10">
        ${extractedContent}
    </main>

    ${authLogicScript}
    ${extraScripts}
    <script src="js/app.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(dir, file), newTemplate);
    console.log(`Updated ${file}`);
}
