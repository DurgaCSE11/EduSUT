import { auth, provider, signInWithPopup, createUserWithEmailAndPassword } from './auth.js';

window.addEventListener('DOMContentLoaded', () => {
    const googleBtn = document.getElementById('btn-google-signin');
    const signupBtn = document.getElementById('btn-manual-signup');
    
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');

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

    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            const email = emailInput.value;
            const pass = passwordInput.value;
            if (!email || !pass) return alert('Enter email and password');
            
            createUserWithEmailAndPassword(auth, email, pass).then(userCredential => {
                window.location.href = 'index.html';
            }).catch(error => alert(error.message));
        });
    }
});
