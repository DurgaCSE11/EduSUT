import { db } from './auth.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

window.handleCourseChange = () => {
    const course = document.getElementById('course-select').value;
    const yearSelect = document.getElementById('year-select');
    yearSelect.innerHTML = '<option value="">Choose Year</option>';
    
    if (course) {
        const years = course === 'BTECH' ? 4 : 5;
        for (let i = 1; i <= years; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = `${i}${i==1?'st':i==2?'nd':i==3?'rd':'th'} Year`;
            yearSelect.appendChild(opt);
        }
    }
};

window.handleYearChange = () => {
    // Just a trigger for potential UI changes
};

window.renderSubjects = async () => {
    const course = document.getElementById('course-select').value;
    const year = document.getElementById('year-select').value;
    const branch = document.getElementById('branch-select').value;
    const container = document.getElementById('subjects-container');

    if (!course || !year || !branch) return;

    container.innerHTML = '<div class="col-span-full py-20 text-center text-slate-500"><i class="fa-solid fa-spinner fa-spin text-4xl mb-4 block"></i><p>Loading subjects...</p></div>';

    try {
        const q = query(
            collection(db, "materials"),
            where("course", "==", course),
            where("year", "==", year),
            where("branch", "==", branch)
        );

        const querySnapshot = await getDocs(q);
        container.innerHTML = '';

        if (querySnapshot.empty) {
            container.innerHTML = '<div class="col-span-full py-20 text-center text-slate-500"><p class="text-xl">No subjects or materials uploaded for this selection yet.</p></div>';
            return;
        }

        // Group by subject
        const subjects = {};
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (!subjects[data.subject]) subjects[data.subject] = [];
            subjects[data.subject].push({ id: doc.id, ...data });
        });

        Object.keys(subjects).forEach(subjectName => {
            const subjectCard = document.createElement('div');
            subjectCard.className = 'bg-cardBg p-6 rounded-3xl border border-white/5 hover:border-primary/30 transition-all group';
            
            let linksHtml = '';
            subjects[subjectName].forEach(item => {
                const icon = item.type === 'syllabus' ? 'fa-scroll' : 'fa-file-lines';
                const label = item.type === 'syllabus' ? 'Syllabus' : 'Notes';
                // Handle both Instant (fileData) and Storage (fileUrl)
                const downloadLink = item.fileData || item.fileUrl;
                
                linksHtml += `
                    <a href="${downloadLink}" download="${item.fileName}" class="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-primary/10 hover:text-primary transition-all mb-2 text-sm">
                        <span class="flex items-center gap-3">
                            <i class="fa-solid ${icon}"></i>
                            ${label}
                        </span>
                        <i class="fa-solid fa-download text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
                    </a>
                `;
            });

            subjectCard.innerHTML = `
                <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-book-open text-primary text-xl"></i>
                </div>
                <h3 class="text-lg font-bold text-white mb-4">${subjectName}</h3>
                <div class="space-y-1">
                    ${linksHtml}
                </div>
            `;
            container.appendChild(subjectCard);
        });

    } catch (error) {
        console.error("Error fetching subjects:", error);
        container.innerHTML = `<p class="text-red-400 text-center col-span-full">Error loading subjects: ${error.message}</p>`;
    }
};
