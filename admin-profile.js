import { supabase, auth, onAuthStateChanged } from "./auth.js";

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
onAuthStateChanged(async (user) => {
    if (user) {
        currentAdminEmail = user.email;
        loadAdminProfile();
    }
});

// --- Profile Logic ---

async function loadAdminProfile() {
    if (!currentAdminEmail) return;
    
    try {
        const { data, error } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('email', currentAdminEmail)
            .maybeSingle();
        
        if (data) {
            profileName.value = data.name || "";
            profileBio.value = data.bio || "";
            profilePhotoUrl.value = data.photo_url || "";
            profilePreview.src = data.photo_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(data.name || "Admin");
            profileGithub.value = data.github_url || "";
            profileLinkedin.value = data.linkedin_url || "";
            profileInstagram.value = data.instagram_url || "";
        } else {
            const user = await auth.getUser();
            profileName.value = user.user_metadata?.full_name || user.email.split('@')[0];
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
        email: currentAdminEmail,
        name: profileName.value,
        bio: profileBio.value,
        photo_url: profilePhotoUrl.value,
        github_url: profileGithub.value,
        linkedin_url: profileLinkedin.value,
        instagram_url: profileInstagram.value,
        updated_at: new Date().toISOString()
    };
    
    try {
        const { error } = await supabase
            .from('admin_profiles')
            .upsert(profileData);

        if (error) throw error;

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
            const video = {
                video_id: videoId,
                title: "Video Solution for " + queryStr.split('/').pop(),
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                author: profileName.value || "Admin",
                subject: "Computer Science",
                duration: "12:45"
            };
            displayResults([video]);
        } else {
            const mockResults = [
                {
                    video_id: "dQw4w9WgXcQ",
                    title: "Advanced Data Structures - Part 1",
                    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
                    author: "VSSUT Senior",
                    subject: "DSA",
                    duration: "15:20"
                },
                {
                    video_id: "y6120QOlsfU",
                    title: "Operating Systems: Process Synchronization",
                    thumbnail: "https://img.youtube.com/vi/y6120QOlsfU/mqdefault.jpg",
                    author: "Academic Cell",
                    subject: "OS",
                    duration: "08:45"
                },
                {
                    video_id: "7thS8S6Z5vY",
                    title: "Database Management Systems: Normalization",
                    thumbnail: "https://img.youtube.com/vi/7thS8S6Z5vY/mqdefault.jpg",
                    author: "EduSUT Mentor",
                    subject: "DBMS",
                    duration: "22:10"
                }
            ];
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
        const { error } = await supabase
            .from('videos')
            .insert(pendingVideos.map(v => ({
                ...v,
                added_by: currentAdminEmail
            })));

        if (error) throw error;

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
