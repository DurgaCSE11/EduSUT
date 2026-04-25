import { auth, provider, signInWithRedirect, getRedirectResult, signInWithEmailAndPassword } from './auth.js';

window.addEventListener('DOMContentLoaded', () => {
    const googleBtn = document.getElementById('btn-google-signin');
    const manualBtn = document.getElementById('btn-manual-signin');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    // Handle the result AFTER returning from Google
    getRedirectResult(auth).then(result => {
        if (result && result.user) {
            window.location.href = 'index.html';
        }
    }).catch(error => {
        console.error("Redirect Error:", error);
    });

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            signInWithRedirect(auth, provider);
        });
    }

    if (manualBtn) {
        manualBtn.addEventListener('click', () => {
            const email = emailInput.value;
            const pass = passwordInput.value;
            if (!email || !pass) return alert('Enter email and password');
            signInWithEmailAndPassword(auth, email, pass)
                .then(() => window.location.href = 'index.html')
                .catch(error => alert("Login failed: Check your email/password"));
        });
    }
});
