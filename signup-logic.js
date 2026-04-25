import { auth, provider, signInWithRedirect, getRedirectResult, createUserWithEmailAndPassword } from './auth.js';

window.addEventListener('DOMContentLoaded', () => {
    const googleBtn = document.getElementById('btn-google-signin');
    const signupBtn = document.getElementById('btn-manual-signup');
    
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');

    // Handle the result AFTER returning from Google
    getRedirectResult(auth).then(result => {
        if (result && result.user) {
            window.location.href = 'index.html';
        }
    }).catch(error => console.error(error));

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            signInWithRedirect(auth, provider);
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            const email = emailInput.value;
            const pass = passwordInput.value;
            if (!email || !pass) return alert('Enter email and password');
            
            createUserWithEmailAndPassword(auth, email, pass)
                .then(() => window.location.href = 'index.html')
                .catch(error => alert("Signup failed: " + error.message));
        });
    }
});
