import { db, doc, getDoc } from "../auth.js";
import { collection, getDocs, query, limit } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

async function loadMakers() {
    const adminName = document.getElementById('maker-admin-name');
    const adminBio = document.getElementById('maker-admin-bio');
    const adminPhoto = document.getElementById('maker-admin-photo');
    const adminGithub = document.getElementById('maker-admin-github');
    const adminLinkedin = document.getElementById('maker-admin-linkedin');
    const adminInstagram = document.getElementById('maker-admin-instagram');

    try {
        // We look for any admin profile. For now, let's just pick the first one or a specific one.
        // Usually, there's only one main admin who edits their bio.
        const q = query(collection(db, "admin_profiles"), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            if (adminName) adminName.textContent = data.name || adminName.textContent;
            if (adminBio) adminBio.textContent = data.bio || adminBio.textContent;
            if (adminPhoto && data.photoUrl) adminPhoto.src = data.photoUrl;
            if (adminGithub && data.socials?.github) adminGithub.href = data.socials.github;
            if (adminLinkedin && data.socials?.linkedin) adminLinkedin.href = data.socials.linkedin;
            if (adminInstagram && data.socials?.instagram) adminInstagram.href = data.socials.instagram;
        }
    } catch (error) {
        console.error("Error loading makers:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadMakers);
