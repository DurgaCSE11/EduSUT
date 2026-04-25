import { db, auth } from "./auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const storage = getStorage();

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
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        progressContainer.classList.remove('hidden');

        // 1. Upload to Storage
        const storagePath = `materials/${metadata.category}s/${Date.now()}_${selectedFile.name}`;
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressBar.style.width = progress + '%';
                progressText.textContent = Math.round(progress) + '%';
            }, 
            (error) => {
                console.error("Upload error:", error);
                alert("Upload failed: " + error.message);
                resetUI();
            }, 
            async () => {
                // 2. Get Download URL
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                
                // 3. Save to Firestore
                await addDoc(collection(db, "materials"), {
                    ...metadata,
                    fileUrl: downloadURL,
                    storagePath: storagePath
                });

                alert("Success! Resource uploaded and recorded.");
                uploadForm.reset();
                resetUI();
            }
        );

    } catch (error) {
        console.error("Error during upload process:", error);
        alert("An error occurred. Check console for details.");
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
