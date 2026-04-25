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

    // Sidebar and Auth Logic
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
            const userRoleEl = document.getElementById('user-role-display');
            
            if (isAdmin) {
                if (userNameEl) userNameEl.textContent = "Moderator";
                if (userRoleEl) userRoleEl.textContent = "EduSUT Admin";
            } else {
                if (userNameEl) userNameEl.textContent = user.displayName || user.email.split('@')[0];
                if (userRoleEl) userRoleEl.textContent = "VSSUT Student";
            }
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
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectLayout);
} else {
    injectLayout();
}
