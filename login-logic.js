import { auth, provider, signInWithPopup, signInWithEmailAndPassword } from './auth.js';

window.addEventListener('DOMContentLoaded', () => {
    const googleBtn = document.getElementById('btn-google-signin');
    const manualBtn = document.getElementById('btn-manual-signin');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            try {
                const result = await signInWithPopup(auth, provider);
                if (result.user) {
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.error("Google Sign-In Error:", error);
                alert("Sign-in failed: " + error.message);
            }
        });
    }

    if (manualBtn) {
        manualBtn.addEventListener('click', () => {
            const email = emailInput.value;
            const pass = passwordInput.value;
            if (!email || !pass) return alert('Enter email and password');
            signInWithEmailAndPassword(auth, email, pass).then(userCredential => {
                window.location.href = 'index.html';
            }).catch(error => alert(error.message));
        });
    }
});
