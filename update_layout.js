// update_layout.js - Shared UI components for EduSUT
import { auth, onAuthStateChanged, checkIsAdmin, signOut } from "./auth.js";

console.log("EduSUT Layout Engine Loading...");

function injectLayout() {
    try {
        const style = document.createElement('style');
        style.textContent = `
            html, body { 
                background-color: #0a0e17 !important; 
                margin: 0; 
                padding: 0; 
                min-height: 100vh;
            }
            body {
                background: linear-gradient(rgba(10, 14, 23, 0.75), rgba(10, 14, 23, 0.75)), url('background.jpg') !important;
                background-size: cover !important;
                background-position: center !important;
                background-attachment: fixed !important;
                background-repeat: no-repeat !important;
            }
            .bg-sidebar { background: rgba(8, 12, 22, 0.4) !important; backdrop-filter: blur(20px) !important; }
            .bg-mainBg { background: transparent !important; }
            .bg-cardBg, .glass-panel, .bg-[#151b2b] { 
                background: rgba(255, 255, 255, 0.03) !important; 
                backdrop-filter: blur(15px) !important; 
                border: 1px solid rgba(255, 255, 255, 0.08) !important; 
            }
        `;
        document.head.appendChild(style);
        console.log("Design System Applied Successfully!");
    } catch (e) {
        console.error("Layout Injection Failed:", e);
    }

    onAuthStateChanged(auth, async (user) => {
        const adminLinks = document.querySelectorAll('#nav-admin-link');
        const adminOnlyElements = document.querySelectorAll('.admin-only');
        const userProfile = document.querySelectorAll('.user-profile-section');
        const guestLinks = document.querySelectorAll('.guest-only');
        
        if (user) {
            const isAdmin = await checkIsAdmin(user.email);
            adminLinks.forEach(link => link.classList.toggle('hidden', !isAdmin));
            adminOnlyElements.forEach(el => el.classList.toggle('hidden', !isAdmin));
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

// Start immediately
injectLayout();
