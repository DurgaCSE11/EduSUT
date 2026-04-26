import { db, auth } from "./auth.js";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { supabaseConfig } from "../config.js";

// Initialize Supabase
const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

const uploadForm = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const dropArea = document.getElementById('drop-area');
const progressContainer = document.getElementById('upload-progress-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const submitBtn = document.getElementById('submit-btn');
const fileStatus = document.getElementById('file-status');

let selectedFile = null;

// Handle Drag and Drop
dropArea.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    handleFileSelection(e.target.files[0]);
});

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('border-primary');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('border-primary');
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('border-primary');
    handleFileSelection(e.dataTransfer.files[0]);
});

function handleFileSelection(file) {
    if (file && file.type === 'application/pdf') {
        selectedFile = file;
        fileStatus.innerHTML = `
            <i class="fa-solid fa-file-pdf text-4xl text-primary mb-4"></i>
            <p class="text-white font-medium">${file.name}</p>
            <p class="text-sm text-slate-500 mt-1">${(file.size / (1024 * 1024)).toFixed(2)} MB</p>
        `;
    } else {
        alert("Please select a valid PDF file.");
    }
}

// Handle Form Submission
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
        alert("Please select a PDF file first.");
        return;
    }

    const metadata = {
        subject: document.getElementById('subject-name').value,
        category: document.getElementById('category').value,
        semester: document.getElementById('semester').value,
        branch: document.getElementById('branch').value,
        uploadedBy: auth.currentUser.email,
        timestamp: serverTimestamp()
    };

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading to Supabase...';
        progressContainer.classList.remove('hidden');
        progressBar.style.width = '30%';
        progressText.textContent = '30%';

        // 1. Upload to Supabase Storage
        const fileName = `${Date.now()}_${selectedFile.name}`;
        const bucketName = 'materials'; // Ensure this bucket exists in Supabase
        const filePath = `${metadata.category}s/${fileName}`;

        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, selectedFile, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        progressBar.style.width = '70%';
        progressText.textContent = '70%';

        // 2. Get Public URL
        const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);
            
        const downloadURL = urlData.publicUrl;
        
        // 3. Save to Firestore
        await addDoc(collection(db, "materials"), {
            ...metadata,
            fileUrl: downloadURL,
            storagePath: filePath,
            provider: 'supabase'
        });

        progressBar.style.width = '100%';
        progressText.textContent = '100%';

        setTimeout(() => {
            alert("Success! Resource uploaded to Supabase and recorded in Firestore.");
            uploadForm.reset();
            resetUI();
        }, 500);

    } catch (error) {
        console.error("Error during upload process:", error);
        alert("Upload failed: " + (error.message || "Unknown error"));
        resetUI();
    }
});

function resetUI() {
    selectedFile = null;
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Confirm Upload';
    progressContainer.classList.add('hidden');
    progressBar.style.width = '0%';
    progressText.textContent = '0%';
    fileStatus.innerHTML = `
        <i class="fa-solid fa-cloud-arrow-up text-4xl text-slate-500 mb-4"></i>
        <p class="text-white font-medium">Click or Drag PDF here</p>
        <p class="text-sm text-slate-500 mt-1">Maximum file size: 20MB</p>
    `;
}
