// js/upload-modal.js
// This script handles the injection and logic for the Upload Modal

function injectUploadModal() {
    if (document.getElementById('upload-modal')) return;

    const modalHtml = `
    <div id="upload-modal" class="hidden fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-[#151b2b] w-full max-w-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-fade-in-up">
            <div class="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <h3 class="text-xl font-bold text-white flex items-center gap-3">
                    <i class="fa-solid fa-cloud-arrow-up text-primary"></i>
                    Upload New Resource
                </h3>
                <button onclick="closeUploadModal()" class="text-slate-400 hover:text-white transition-colors">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>

            <form id="upload-form" class="p-8 space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Course</label>
                        <select id="modal-course" required class="w-full bg-darkBg border border-glassBorder rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary">
                            <option value="BTECH">B.Tech</option>
                            <option value="BARCH">B.Arch</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Year</label>
                        <select id="modal-year" required class="w-full bg-darkBg border border-glassBorder rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary">
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Branch</label>
                        <select id="modal-branch" required class="w-full bg-darkBg border border-glassBorder rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary">
                            <option value="CSE">CSE</option>
                            <option value="IT">IT</option>
                            <option value="ECE">ECE</option>
                            <option value="EE">EE</option>
                            <option value="ME">ME</option>
                            <option value="CE">CE</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Type</label>
                        <select id="modal-type" required class="w-full bg-darkBg border border-glassBorder rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary">
                            <option value="notes">Study Notes</option>
                            <option value="syllabus">Syllabus</option>
                            <option value="pyq">Previous Year Question</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Subject Name</label>
                    <input type="text" id="modal-subject" required placeholder="e.g. Data Structures" class="w-full bg-darkBg border border-glassBorder rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary">
                </div>

                <div>
                    <label class="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Select PDF File</label>
                    <input type="file" id="modal-file" accept=".pdf" required class="w-full bg-darkBg border border-glassBorder rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer">
                </div>

                <div id="upload-progress-container" class="hidden space-y-2">
                    <div class="flex justify-between text-xs text-slate-400">
                        <span id="upload-status">Uploading...</span>
                    </div>
                    <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div id="upload-progress-bar" class="bg-primary h-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                </div>

                <button type="submit" id="submit-btn" class="w-full bg-primary hover:bg-primaryHover text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3">
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    Confirm & Upload
                </button>
            </form>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

window.openUploadModal = () => {
    const modal = document.getElementById('upload-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
};

window.closeUploadModal = () => {
    const modal = document.getElementById('upload-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectUploadModal);
} else {
    injectUploadModal();
}
