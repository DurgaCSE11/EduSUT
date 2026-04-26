import { supabase, auth } from './auth.js';

window.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    if (!uploadForm) return;

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const user = await auth.getUser();
        if (!user) return alert("Please login first");

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
        progressBar.style.width = '20%';
        statusText.textContent = "Initializing Supabase Upload...";
        
        try {
            // 1. Upload File to Supabase Storage
            const fileName = `${Date.now()}_${file.name}`;
            const bucketName = 'materials'; 
            const filePath = `${course}/${year}/${branch}/${fileName}`;

            const { data, error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            progressBar.style.width = '60%';
            statusText.textContent = "Fetching public URL...";

            // 2. Get Public URL
            const { data: urlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            const downloadURL = urlData.publicUrl;

            progressBar.style.width = '80%';
            statusText.textContent = "Recording metadata in Database...";

            // 3. Save Metadata to Supabase Table (Replaces Firestore)
            const { error: dbError } = await supabase
                .from('materials')
                .insert({
                    course,
                    year,
                    branch,
                    subject,
                    category: type, // Using category field for type
                    file_url: downloadURL,
                    storage_path: filePath,
                    uploaded_by: user.email
                });

            if (dbError) throw dbError;

            progressBar.style.width = '100%';
            statusText.textContent = "✅ Upload Successful!";
            
            setTimeout(() => {
                window.closeUploadModal();
                location.reload();
            }, 1500);

        } catch (error) {
            console.error("Error during upload:", error);
            alert("Upload failed: " + (error.message || "Unknown error"));
            progressContainer.classList.add('hidden');
        }
    });
});
