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

// Simplified Auth exports for Supabase
const auth = {
    getUser: async () => (await supabase.auth.getUser()).data.user,
    signOut: async () => await supabase.auth.signOut(),
    onAuthStateChanged: (callback) => {
        supabase.auth.onAuthStateChange((event, session) => {
            callback(session?.user || null);
        });
    }
};

export { supabase, auth, checkIsAdmin };
