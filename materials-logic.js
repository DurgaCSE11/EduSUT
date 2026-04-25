const firstYearSubjects = ["BEE", "PHYSICS", "CDS", "BMP", "ETW", "MATH-I", "MATH-II", "CHEM", "BE", "EM", "BCE", "UHV", "CDS LAB", "PHYSICS LAB", "WDM LAB", "BEE LAB", "BE LAB", "CERW LAB", "CHEM LAB", "EGD LAB"];

function handleCourseChange() {
    const course = document.getElementById('course-select').value;
    const yearSelect = document.getElementById('year-select');
    yearSelect.innerHTML = '<option value="">Choose Year</option>';
    
    if (course === 'BTECH') {
        for (let i = 1; i <= 4; i++) {
            yearSelect.innerHTML += `<option value="${i}">${i}${getOrdinal(i)} Year</option>`;
        }
    } else if (course === 'BARCH') {
        for (let i = 1; i <= 5; i++) {
            yearSelect.innerHTML += `<option value="${i}">${i}${getOrdinal(i)} Year</option>`;
        }
    }
    renderSubjects();
}

function handleYearChange() {
    renderSubjects();
}

function renderSubjects() {
    const course = document.getElementById('course-select').value;
    const year = document.getElementById('year-select').value;
    const branch = document.getElementById('branch-select').value;
    const container = document.getElementById('subjects-container');

    if (!course || !year || !branch) {
        container.innerHTML = `
            <div class="col-span-full py-20 text-center text-slate-500">
                <i class="fa-solid fa-arrow-up text-4xl mb-4 block"></i>
                <p class="text-xl">Select your Course, Year, and Branch to see subjects.</p>
            </div>`;
        return;
    }

    if (year === '1') {
        container.innerHTML = firstYearSubjects.map(sub => `
            <div onclick="openSubject('${sub}')" class="subject-card p-6 rounded-2xl cursor-pointer">
                <div class="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl mb-4">
                    <i class="fa-solid fa-book"></i>
                </div>
                <h3 class="text-lg font-bold text-white mb-1">${sub}</h3>
                <p class="text-xs text-slate-500 uppercase tracking-wider">1st Year • All Branches</p>
            </div>
        `).join('');
    } else {
        container.innerHTML = `
            <div class="col-span-full py-20 text-center text-slate-500">
                <i class="fa-solid fa-hourglass-half text-4xl mb-4 block"></i>
                <p class="text-xl">Materials for ${year}${getOrdinal(year)} Year ${branch} are coming soon.</p>
            </div>`;
    }
}

function openSubject(subject) {
    window.location.href = `subject-detail.html?subject=${encodeURIComponent(subject)}`;
}

function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}

// Initialize if elements exist
window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('course-select')) {
        // Any init logic
    }
});
