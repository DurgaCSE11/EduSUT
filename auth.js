import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { supabaseConfig } from "./config.js";

console.log("EduSUT Auth: Initializing Supabase client...");
const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

// Helper function to check if a user is an admin
async function checkIsAdmin(email) {
    if (!email) return false;
    try {
        const { data, error } = await supabase
            .from('whitelisted_admins')
            .select('email')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error("EduSUT Auth: Error checking admin status:", error);
        }
        return !!data;
    } catch (error) {
        console.error("EduSUT Auth: Exception in checkIsAdmin:", error);
        return false;
    }
}

// Supabase Auth Methods mapped to Firebase-like names for compatibility
const auth = {
    getUser: async () => {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;
            return user;
        } catch (e) {
            console.warn("EduSUT Auth: getUser failed:", e.message);
            return null;
        }
    },
    signOut: async () => {
        console.log("EduSUT Auth: Signing out...");
        return await supabase.auth.signOut();
    },
    onAuthStateChanged: (callbackOrAuth, callback) => {
        const actualCallback = typeof callbackOrAuth === 'function' ? callbackOrAuth : callback;
        if (!actualCallback) {
            console.error("EduSUT Auth: onAuthStateChanged called without callback");
            return;
        }

        console.log("EduSUT Auth: Setting up onAuthStateChanged listener...");

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("EduSUT Auth: Auth state changed event:", event, session?.user?.email);
            actualCallback(session?.user || null);
        });

        // Initial check in case onAuthStateChange doesn't fire immediately
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log("EduSUT Auth: Initial session check:", session?.user?.email || "No user");
            actualCallback(session?.user || null);
        }).catch(err => {
            console.error("EduSUT Auth: Initial session check failed:", err);
            actualCallback(null);
        });

        return subscription;
    }
};

const onAuthStateChanged = auth.onAuthStateChanged;

async function signOut(authObj) {
    return await auth.signOut();
}

// Mocking Firebase provider for compatibility
const provider = { provider: 'google' };

async function signInWithPopup(authObj, providerObj) {
    console.log("EduSUT Auth: Initiating OAuth redirect to Google...");
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/index.html',
                skipBrowserRedirect: true
            }
        });
        
        if (error) {
            console.error("EduSUT Auth: OAuth Error Details:", error.message, error);
            alert("Login Error: " + error.message);
            throw error;
        }

        if (data?.url) {
            console.log("EduSUT Auth: Forcing redirect via programmatic link click...");
            
            // 1. Create a physical link and click it (harder for browsers to block)
            const link = document.createElement('a');
            link.href = data.url;
            document.body.appendChild(link);
            link.click();

            // 2. Fallback UI in case the browser still blocks it
            const fallback = document.createElement('div');
            fallback.id = 'auth-fallback-ui';
            fallback.innerHTML = `
                <div style="position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:10000;background:#6366f1;color:white;padding:12px 24px;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.3);text-align:center;font-family:sans-serif;">
                    Redirecting to Google... 
                    <a href="${data.url}" style="color:white;text-decoration:underline;font-weight:bold;margin-left:10px;">Click here if nothing happens</a>
                </div>
            `;
            document.body.appendChild(fallback);

            // 3. Last resort direct navigation after a tiny delay
            setTimeout(() => { 
                console.log("EduSUT Auth: Last resort navigation trigger...");
                window.location.assign(data.url); 
            }, 500);
            
            return new Promise(() => {}); 
        } else {
            console.error("EduSUT Auth: No redirect URL returned from Supabase");
            alert("Login Error: No redirect URL returned.");
        }
        
        return { user: data?.user }; 
    } catch (err) {
        console.error("EduSUT Auth: Critical OAuth Exception:", err);
        throw err;
    }
}

async function signInWithEmailAndPassword(authObj, email, password) {
    const actualEmail = typeof authObj === 'string' ? authObj : email;
    const actualPassword = typeof authObj === 'string' ? email : password;

    console.log("EduSUT Auth: Signing in with email:", actualEmail);
    const { data, error } = await supabase.auth.signInWithPassword({
        email: actualEmail,
        password: actualPassword
    });
    if (error) {
        console.error("EduSUT Auth: Email sign-in error:", error);
        throw error;
    }
    return { user: data.user };
}

async function createUserWithEmailAndPassword(authObj, email, password) {
    const actualEmail = typeof authObj === 'string' ? authObj : email;
    const actualPassword = typeof authObj === 'string' ? email : password;

    console.log("EduSUT Auth: Creating account for email:", actualEmail);
    const { data, error } = await supabase.auth.signUp({
        email: actualEmail,
        password: actualPassword
    });
    if (error) {
        console.error("EduSUT Auth: Signup error:", error);
        throw error;
    }
    return { user: data.user };
}

export { 
    supabase, 
    auth, 
    checkIsAdmin, 
    onAuthStateChanged, 
    signOut, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    provider 
};
