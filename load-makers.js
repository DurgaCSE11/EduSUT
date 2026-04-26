import { supabase } from "../auth.js";

async function loadMakers() {
    const adminName = document.getElementById('maker-admin-name');
    const adminBio = document.getElementById('maker-admin-bio');
    const adminPhoto = document.getElementById('maker-admin-photo');
    const adminGithub = document.getElementById('maker-admin-github');
    const adminLinkedin = document.getElementById('maker-admin-linkedin');
    const adminInstagram = document.getElementById('maker-admin-instagram');

    try {
        const { data, error } = await supabase
            .from('admin_profiles')
            .select('*')
            .limit(1)
            .maybeSingle();
        
        if (data) {
            if (adminName) adminName.textContent = data.name || adminName.textContent;
            if (adminBio) adminBio.textContent = data.bio || adminBio.textContent;
            if (adminPhoto && data.photo_url) adminPhoto.src = data.photo_url;
            if (adminGithub && data.github_url) adminGithub.href = data.github_url;
            if (adminLinkedin && data.linkedin_url) adminLinkedin.href = data.linkedin_url;
            if (adminInstagram && data.instagram_url) adminInstagram.href = data.instagram_url;
        }
    } catch (error) {
        console.error("Error loading makers:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadMakers);
