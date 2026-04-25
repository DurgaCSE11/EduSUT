import { auth, provider, signInWithRedirect, getRedirectResult, signInWithPopup, signInWithEmailAndPassword } from './auth.js';

window.addEventListener('DOMContentLoaded', () => {
    const googleBtn = document.getElementById('btn-google-signin');
    
    // Check for redirect result immediately
    getRedirectResult(auth).then(result => {
        if (result && result.user) {
            console.log("Logged in via redirect!");
            window.location.href = 'index.html';
        }
    }).catch(error => {
        console.error("Redirect Login Error:", error.code, error.message);
    });

    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            try {
                // Try popup first as it's more reliable if redirects are failing
                const result = await signInWithPopup(auth, provider);
                if (result.user) {
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.warn("Popup blocked or failed, trying redirect...", error.code);
                // Fallback to redirect if popup is blocked
                signInWithRedirect(auth, provider);
            }
        });
    }
});
