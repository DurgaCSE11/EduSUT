import { db, auth, onAuthStateChanged, doc, getDoc, setDoc } from "../auth.js";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { collection, addDoc, serverTimestamp, query, getDocs, where } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { supabaseConfig } from "../config.js";

// Initialize Supabase
const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

// Modal elements
const profileModal = document.getElementById('profile-modal');
const videoModal = document.getElementById('video-modal');

// Profile form elements
const profileName = document.getElementById('profile-name');
const profileBio = document.getElementById('profile-bio');
const profilePhotoUrl = document.getElementById('profile-photo-url');
const profilePreview = document.getElementById('profile-preview');
const profileGithub = document.getElementById('profile-github');
const profileLinkedin = document.getElementById('profile-linkedin');
const profileInstagram = document.getElementById('profile-instagram');
const btnSaveProfile = document.getElementById('btn-save-profile');
const profilePhotoInput = document.getElementById('profile-photo-input');

// Video manager elements
const youtubeSearchQuery = document.getElementById('youtube-search-query');
const btnScrapeVideo = document.getElementById('btn-scrape-video');
const videoResultsGrid = document.getElementById('video-results-grid');
const scrapeStatus = document.getElementById('scrape-status');
const btnSaveVideos = document.getElementById('btn-save-videos');

let currentAdminEmail = null;
let pendingVideos = [];

// Initialize
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentAdminEmail = user.email;
        loadAdminProfile();
    }
});

// --- Profile Logic ---

async function loadAdminProfile() {
    if (!currentAdminEmail) return;
    
    try {
        const docRef = doc(db, "admin_profiles", currentAdminEmail);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            profileName.value = data.name || "";
            profileBio.value = data.bio || "";
            profilePhotoUrl.value = data.photoUrl || "";
            profilePreview.src = data.photoUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(data.name || "Admin");
            profileGithub.value = data.socials?.github || "";
            profileLinkedin.value = data.socials?.linkedin || "";
            profileInstagram.value = data.socials?.instagram || "";
        } else {
            // Default values
            profileName.value = auth.currentUser.displayName || "";
        }
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

btnSaveProfile?.addEventListener('click', async () => {
    if (!currentAdminEmail) return;
    
    btnSaveProfile.disabled = true;
    btnSaveProfile.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...';
    
    const profileData = {
        name: profileName.value,
        bio: profileBio.value,
        photoUrl: profilePhotoUrl.value,
        socials: {
            github: profileGithub.value,
            linkedin: profileLinkedin.value,
            instagram: profileInstagram.value
        },
        updatedAt: serverTimestamp()
    };
    
    try {
        await setDoc(doc(db, "admin_profiles", currentAdminEmail), profileData);
        alert("Profile updated successfully!");
        closeModals();
    } catch (error) {
        console.error("Error saving profile:", error);
        alert("Failed to save profile.");
    } finally {
        btnSaveProfile.disabled = false;
        btnSaveProfile.innerHTML = 'Save Changes';
    }
});

profilePhotoUrl?.addEventListener('input', () => {
    if (profilePhotoUrl.value) {
        profilePreview.src = profilePhotoUrl.value;
    }
});

profilePhotoInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }

    const originalText = document.querySelector('label[for="profile-photo-input"]')?.textContent || "Change Photo";
    const label = e.target.parentElement;
    
    try {
        label.classList.add('opacity-50', 'pointer-events-none');
        label.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Uploading...';

        const fileName = `admin_${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, file);

        if (error) throw error;

        const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        profilePhotoUrl.value = urlData.publicUrl;
        profilePreview.src = urlData.publicUrl;
        alert('Photo uploaded successfully!');

    } catch (error) {
        console.error('Photo upload failed:', error);
        alert('Upload failed: ' + error.message);
    } finally {
        label.classList.remove('opacity-50', 'pointer-events-none');
        label.innerHTML = 'Change Photo';
    }
});

// --- YouTube "Scraper" Logic ---

function extractVideoID(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}

btnScrapeVideo?.addEventListener('click', async () => {
    const queryStr = youtubeSearchQuery.value.trim();
    if (!queryStr) return;
    
    btnScrapeVideo.disabled = true;
    btnScrapeVideo.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Fetching...';
    scrapeStatus.textContent = "Connecting to YouTube API (Simulated)...";
    
    const videoId = extractVideoID(queryStr);
    
    setTimeout(() => {
        if (videoId) {
            // Direct Link Scrape
            const video = {
                videoId: videoId,
                title: "Loading video title...", // In a real app, we'd fetch this from oEmbed or Data API
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                author: profileName.value || "Admin",
                subject: "Computer Science", // Default
                duration: "12:45"
            };
            
            // Attempt to get title from oEmbed proxy if possible, or just mock it
            video.title = "Video Solution for " + queryStr.split('/').pop();
            
            displayResults([video]);
        } else {
            // Search Scrape Simulation
            const mockResults = [
                {
                    videoId: "dQw4w9WgXcQ",
                    title: "Advanced Data Structures - Part 1",
                    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
                    author: "VSSUT Senior",
                    subject: "DSA",
                    duration: "15:20"
                },
                {
                    videoId: "y6120QOlsfU",
                    title: "Operating Systems: Process Synchronization",
                    thumbnail: "https://img.youtube.com/vi/y6120QOlsfU/mqdefault.jpg",
                    author: "Academic Cell",
                    subject: "OS",
                    duration: "08:45"
                },
                {
                    videoId: "7thS8S6Z5vY",
                    title: "Database Management Systems: Normalization",
                    thumbnail: "https://img.youtube.com/vi/7thS8S6Z5vY/mqdefault.jpg",
                    author: "EduSUT Mentor",
                    subject: "DBMS",
                    duration: "22:10"
                }
            ];
            
            // Filter by query if needed, or just return them
            displayResults(mockResults);
        }
        
        btnScrapeVideo.disabled = false;
        btnScrapeVideo.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Fetch';
        scrapeStatus.textContent = "Scraping complete. Select videos to add.";
    }, 1500);
});

function displayResults(videos) {
    videoResultsGrid.innerHTML = '';
    pendingVideos = videos;
    
    videos.forEach((v, index) => {
        const item = document.createElement('div');
        item.className = 'bg-mainBg/50 p-4 rounded-2xl border border-white/5 flex gap-4 group cursor-pointer hover:border-rose-500/50 transition-all';
        item.innerHTML = `
            <div class="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                <img src="${v.thumbnail}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
            </div>
            <div class="flex-grow">
                <h4 class="text-sm font-bold text-white mb-1 line-clamp-1">${v.title}</h4>
                <p class="text-[10px] text-slate-500 mb-2">${v.author} • ${v.subject}</p>
                <div class="flex items-center gap-2">
                    <span class="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">Selected</span>
                </div>
            </div>
        `;
        videoResultsGrid.appendChild(item);
    });
    
    btnSaveVideos.classList.remove('hidden');
    btnSaveVideos.disabled = false;
}

btnSaveVideos?.addEventListener('click', async () => {
    btnSaveVideos.disabled = true;
    btnSaveVideos.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Adding...';
    
    try {
        for (const video of pendingVideos) {
            await addDoc(collection(db, "videos"), {
                ...video,
                timestamp: serverTimestamp(),
                addedBy: currentAdminEmail
            });
        }
        alert("Videos added to gallery!");
        closeModals();
        videoResultsGrid.innerHTML = '';
        btnSaveVideos.classList.add('hidden');
    } catch (error) {
        console.error("Error adding videos:", error);
        alert("Failed to add videos.");
    } finally {
        btnSaveVideos.disabled = false;
        btnSaveVideos.innerHTML = 'Add to Gallery';
    }
});

// --- Modal Controls ---

window.closeModals = function() {
    profileModal.classList.add('hidden');
    videoModal.classList.add('hidden');
};

document.getElementById('btn-open-profile')?.addEventListener('click', () => {
    profileModal.classList.remove('hidden');
});

document.getElementById('btn-open-video-manager')?.addEventListener('click', () => {
    videoModal.classList.remove('hidden');
});
