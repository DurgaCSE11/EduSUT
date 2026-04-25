import { auth, db } from './auth.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const storage = getStorage();

window.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    if (!uploadForm) return;

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const course = document.getElementById('modal-course').value;
        const year = document.getElementById('modal-year').value;
        const branch = document.getElementById('modal-branch').value;
        const subject = document.getElementById('modal-subject').value;
        const type = document.getElementById('modal-type').value;
        const file = document.getElementById('modal-file').files[0];

        if (!file) return alert("Please select a file");

        const progressContainer = document.getElementById('upload-progress-container');
        const progressBar = document.getElementById('upload-progress-bar');
        const statusText = document.getElementById('upload-status');

        progressContainer.classList.remove('hidden');
        
        try {
            // 1. Upload File to Firebase Storage
            const storagePath = `materials/${course}/${year}/${branch}/${Date.now()}_${file.name}`;
            const storageRef = ref(storage, storagePath);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    progressBar.style.width = progress + '%';
                    statusText.textContent = `Uploading: ${Math.round(progress)}%`;
                }, 
                (error) => {
                    console.error("Upload failed:", error);
                    alert("Upload failed: " + error.message);
                }, 
                async () => {
                    // 2. Get Download URL
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    // 3. Save Metadata to Firestore
                    await addDoc(collection(db, "materials"), {
                        course,
                        year,
                        branch,
                        subject,
                        type, // 'syllabus' or 'notes'
                        fileName: file.name,
                        fileUrl: downloadURL,
                        uploadedBy: auth.currentUser.email,
                        createdAt: serverTimestamp()
                    });

                    statusText.textContent = "✅ Upload Successful!";
                    setTimeout(() => {
                        window.closeUploadModal();
                        location.reload();
                    }, 1500);
                }
            );

        } catch (error) {
            console.error("Error during upload:", error);
            alert("An error occurred: " + error.message);
        }
    });
});
