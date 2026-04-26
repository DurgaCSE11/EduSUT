import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { supabaseConfig } from "./config.js";

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

        return !!data;
    } catch (error) {
        return false;
    }
}

// Supabase Auth Methods mapped to Firebase-like names for compatibility
const auth = {
    getUser: async () => (await supabase.auth.getUser()).data.user,
    signOut: async () => await supabase.auth.signOut(),
    onAuthStateChanged: (callbackOrAuth, callback) => {
        const actualCallback = typeof callbackOrAuth === 'function' ? callbackOrAuth : callback;
        if (!actualCallback) return;

        // Initial check
        supabase.auth.getUser().then(({ data: { user } }) => {
            actualCallback(user || null);
        });
        
        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            actualCallback(session?.user || null);
        });
        return subscription;
    }
};

const onAuthStateChanged = auth.onAuthStateChanged;

async function signOut(authObj) {
    return await supabase.auth.signOut();
}

// Mocking Firebase provider for compatibility
const provider = { provider: 'google' };

async function signInWithPopup(authObj, providerObj) {
    // Note: Supabase's signInWithOAuth usually redirects. 
    // If you want a popup, you'd need to handle it differently, but for now we'll use the redirect flow.
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/index.html'
        }
    });
    if (error) throw error;
    return { user: data?.user }; 
}

async function signInWithEmailAndPassword(authObj, email, password) {
    const actualEmail = typeof authObj === 'string' ? authObj : email;
    const actualPassword = typeof authObj === 'string' ? email : password;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: actualEmail,
        password: actualPassword
    });
    if (error) throw error;
    return { user: data.user };
}

async function createUserWithEmailAndPassword(authObj, email, password) {
    const actualEmail = typeof authObj === 'string' ? authObj : email;
    const actualPassword = typeof authObj === 'string' ? email : password;

    const { data, error } = await supabase.auth.signUp({
        email: actualEmail,
        password: actualPassword
    });
    if (error) throw error;
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
