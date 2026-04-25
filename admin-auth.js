import { auth, provider, signInWithPopup, onAuthStateChanged, signOut, checkIsAdmin } from "./auth.js";

const loginOverlay = document.getElementById('login-overlay');
const loginBtn = document.getElementById('admin-login-btn');
const logoutBtn = document.getElementById('admin-logout-btn');
const authError = document.getElementById('auth-error');

// Handle Login
loginBtn.addEventListener('click', async () => {
    try {
        authError.classList.add('hidden');
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Use the centralized checkIsAdmin function from auth.js
        const isAdmin = await checkIsAdmin(user.email);
        
        if (isAdmin) {
            loginOverlay.classList.add('hidden');
        } else {
            // Not in whitelist
            await signOut(auth);
            authError.textContent = "Access Denied: Your email is not authorized for Admin access.";
            authError.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Login failed:", error);
        authError.textContent = "Login failed. Please try again.";
        authError.classList.remove('hidden');
    }
});

// Handle Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await signOut(auth);
        window.location.href = "index.html";
    });
}

// Monitor Auth State
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const isAdmin = await checkIsAdmin(user.email);
        if (isAdmin) {
            loginOverlay.classList.add('hidden');
        } else {
            // User logged in but not an admin
            await signOut(auth);
            loginOverlay.classList.remove('hidden');
        }
    } else {
        loginOverlay.classList.remove('hidden');
    }
});
