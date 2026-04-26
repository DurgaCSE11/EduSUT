// update_layout.js - Shared UI components for EduSUT
import { auth, onAuthStateChanged, checkIsAdmin, signOut } from "./auth.js";

function injectLayout() {
    // Add custom glassmorphism styles
    const style = document.createElement('style');
    style.textContent = `
        body {
            background: linear-gradient(rgba(15, 20, 35, 0.88), rgba(15, 20, 35, 0.88)), url('background.jpeg');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-color: #0f1423;
        }
        .bg-sidebar { background: rgba(8, 12, 22, 0.8) !important; backdrop-filter: blur(16px); }
        .bg-mainBg { background: transparent !important; }
        .bg-cardBg, .glass-panel, .bg-[#151b2b] { 
            background: rgba(21, 27, 43, 0.6) !important; 
            backdrop-filter: blur(12px); 
            border: 1px solid rgba(255, 255, 255, 0.05) !important; 
        }
    `;
    document.head.appendChild(style);

    // Hide auth-dependent elements immediately to prevent flicker
    document.querySelectorAll('.guest-only, .user-profile-section, .admin-only, #nav-admin-link').forEach(el => el.classList.add('hidden'));

    // Sidebar and Auth Logic
    onAuthStateChanged((user) => {
        const adminLinks = document.querySelectorAll('#nav-admin-link');
        const adminOnlyElements = document.querySelectorAll('.admin-only');
        const userProfile = document.querySelectorAll('.user-profile-section');
        const guestLinks = document.querySelectorAll('.guest-only');
        
        if (user) {
            // 1. Show user profile IMMEDIATELY
            userProfile.forEach(el => el.classList.remove('hidden'));
            guestLinks.forEach(el => el.classList.add('hidden'));

            const userNameEls = document.querySelectorAll('#user-name-display');
            const userRoleEls = document.querySelectorAll('#user-role-display');
            
            // Supabase user metadata check
            const displayName = user.user_metadata?.full_name || user.email.split('@')[0];
            
            const updateUI = (isAdmin) => {
                userNameEls.forEach(el => el.textContent = displayName);
                userRoleEls.forEach(el => el.textContent = isAdmin ? "(Admin)" : "(Student)");
                
                adminLinks.forEach(link => {
                    if (isAdmin) link.classList.remove('hidden');
                    else link.classList.add('hidden');
                });
                adminOnlyElements.forEach(el => {
                    if (isAdmin) el.classList.remove('hidden');
                    else el.classList.add('hidden');
                });
            };

            // 2. Check cached admin status
            const cachedAdmin = localStorage.getItem(`isAdmin_${user.email}`) === 'true';
            updateUI(cachedAdmin);

            // 3. Verify real admin status
            checkIsAdmin(user.email).then(isAdmin => {
                localStorage.setItem(`isAdmin_${user.email}`, isAdmin);
                updateUI(isAdmin);
            });
        } else {
            adminLinks.forEach(link => link.classList.add('hidden'));
            adminOnlyElements.forEach(el => el.classList.add('hidden'));
            userProfile.forEach(el => el.classList.add('hidden'));
            guestLinks.forEach(el => el.classList.remove('hidden'));
        }
    });

    window.handleLogout = async () => {
        await signOut();
        window.location.reload();
    };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectLayout);
} else {
    injectLayout();
}
