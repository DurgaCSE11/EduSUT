
// --- Theme Toggle ---
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    updateThemeIcons(!isDark);
}

function updateThemeIcons(isDark) {
    const btns = document.querySelectorAll('.theme-toggle-btn');
    const mBtns = document.querySelectorAll('.theme-toggle-mobile-btn');
    
    btns.forEach(btn => {
        btn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
    
    mBtns.forEach(mBtn => {
        mBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun w-6"></i> Light Mode' : '<i class="fa-solid fa-moon w-6"></i> Dark Mode';
    });
}

// --- Navigation Logic ---
function navigate(targetId) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('block');
    });

    // Show target section
    const targetSection = document.getElementById(`section-${targetId}`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('block');
    }

    // Update Desktop Nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-target') === targetId) {
            link.classList.add('active');
        }
    });

    // Update Mobile Nav
    document.querySelectorAll('.nav-link-mobile').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-target') === targetId) {
            link.classList.add('active');
        }
    });

    // Close mobile menu if open
    document.getElementById('mobile-menu').classList.add('hidden');
    window.scrollTo(0, 0);
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}


// --- Mock Data ---
const pyqs = [
    { title: 'Data Structures', sem: '3rd', branch: 'CSE', type: 'End-Sem', year: 2024 },
    { title: 'Basic Electronics', sem: '1st', branch: 'EE', type: 'Mid-Sem', year: 2024 },
    { title: 'Operating Systems', sem: '5th', branch: 'CSE', type: 'End-Sem', year: 2023 },
    { title: 'Thermodynamics', sem: '3rd', branch: 'ME', type: 'End-Sem', year: 2023 },
    { title: 'Engineering Maths-I', sem: '1st', branch: 'All', type: 'Mid-Sem', year: 2024 },
    { title: 'Computer Networks', sem: '6th', branch: 'CSE', type: 'End-Sem', year: 2022 },
];

const materials = [
    { title: 'Complete DSA Notes', type: 'Handwritten', author: 'Rahul P.', rating: 4.8 },
    { title: 'OS Process Management', type: 'Typed', author: 'Sneha M.', rating: 4.9 },
    { title: 'Basic Electronics Circuit Analysis', type: 'Handwritten', author: 'Aman D.', rating: 4.5 },
    { title: 'DBMS Normalization Cheatsheet', type: 'Typed', author: 'Priti K.', rating: 4.7 },
];

const doubts = [
    { title: 'Dijkstra vs Bellman Ford?', subject: 'Algorithms', author: 'Senior - Rohit' },
    { title: 'K-Map simplification trick', subject: 'Digital Electronics', author: 'Senior - Ananya' },
    { title: 'Pointers in C explained', subject: 'C Programming', author: 'Senior - Dev' },
];

const mcqs = [
    { q: 'Time complexity of Binary Search?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], ans: 2 },
    { q: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Tree', 'Graph'], ans: 1 },
];


// --- Render Functions ---
function renderPYQs() {
    const grid = document.getElementById('pyq-grid');
    grid.innerHTML = pyqs.map(p => `
        <div class="glass-card p-5 rounded-xl flex flex-col justify-between">
            <div>
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-semibold text-white">${p.title}</h3>
                    <span class="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded border border-indigo-500/30">${p.year}</span>
                </div>
                <div class="flex gap-2 text-xs text-slate-400 mb-4">
                    <span>${p.branch}</span> &bull; <span>${p.sem} Sem</span> &bull; <span>${p.type}</span>
                </div>
            </div>
            <div class="flex gap-2">
                <button class="flex-1 bg-darkBg border border-glassBorder hover:bg-glassBg text-slate-300 py-2 rounded-lg text-sm transition-colors"><i class="fa-solid fa-eye mr-1"></i> Preview</button>
                <button class="flex-1 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-400 py-2 rounded-lg text-sm transition-colors"><i class="fa-solid fa-download mr-1"></i> Download</button>
            </div>
        </div>
    `).join('');
}

function renderMaterials() {
    const grid = document.getElementById('materials-grid');
    grid.innerHTML = materials.map(m => `
        <div class="glass-card p-5 rounded-xl">
            <div class="flex justify-between items-start mb-2">
                <span class="text-xs text-purple-400 font-medium">${m.type}</span>
                <span class="text-xs text-amber-400 flex items-center gap-1"><i class="fa-solid fa-star"></i> ${m.rating}</span>
            </div>
            <h3 class="text-lg font-semibold text-white mb-1">${m.title}</h3>
            <p class="text-xs text-slate-500 mb-4">Uploaded by: ${m.author}</p>
            <div class="flex justify-between items-center">
                <button class="text-sm text-slate-300 hover:text-white"><i class="fa-solid fa-eye mr-1"></i> View</button>
                <button class="text-sm text-slate-300 hover:text-purple-400"><i class="fa-regular fa-thumbs-up mr-1"></i> Like</button>
            </div>
        </div>
    `).join('');
}

function renderDoubts() {
    const grid = document.getElementById('doubts-grid');
    grid.innerHTML = doubts.map(d => `
        <div class="glass-card overflow-hidden rounded-xl group">
            <div class="h-40 bg-darkBg flex items-center justify-center relative cursor-pointer group-hover:bg-[#1a1a1a] transition-colors border-b border-glassBorder">
                <div class="w-12 h-12 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-play ml-1"></i>
                </div>
            </div>
            <div class="p-4">
                <span class="text-xs text-rose-400 font-medium">${d.subject}</span>
                <h3 class="font-semibold text-white mb-1 leading-tight">${d.title}</h3>
                <p class="text-xs text-slate-500">Solved by ${d.author}</p>
            </div>
        </div>
    `).join('');
}

function renderMCQs() {
    const container = document.getElementById('mcq-container');
    container.innerHTML = mcqs.map((m, index) => `
        <div class="glass-card p-5 rounded-xl border-l-4 border-l-primary">
            <p class="text-sm text-slate-200 mb-3 font-medium">Q${index + 1}. ${m.q}</p>
            <div class="space-y-2">
                ${m.options.map((opt, i) => `
                    <button onclick="checkMCQ(this, ${i}, ${m.ans})" class="w-full text-left px-4 py-2 rounded-lg border border-glassBorder text-sm text-slate-400 hover:text-white hover:border-primary/50 transition-colors">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function checkMCQ(btn, selected, correct) {
    const parent = btn.parentElement;
    // Disable all buttons
    Array.from(parent.children).forEach(b => {
        b.disabled = true;
        b.classList.add('cursor-not-allowed', 'opacity-70');
    });
    
    if (selected === correct) {
        btn.classList.replace('border-glassBorder', 'border-emerald-500');
        btn.classList.add('bg-emerald-500/10', 'text-emerald-400');
    } else {
        btn.classList.replace('border-glassBorder', 'border-rose-500');
        btn.classList.add('bg-rose-500/10', 'text-rose-400');
        // Highlight correct
        parent.children[correct].classList.replace('border-glassBorder', 'border-emerald-500');
        parent.children[correct].classList.add('bg-emerald-500/10', 'text-emerald-400');
    }
}


// --- CGPA Calculator Logic (Wizard) ---
let cgpaState = {
    branch: '',
    theoryCount: 0,
    labCount: 0,
    subjects: [], // { name, marks, credit, type }
};
let currentStep = 1;

function gradePoint(g) {
    return { O:10, 'A+':9, A:8, 'B+':7, B:6, C:5, F:0 }[g] ?? 0;
}

function calculateGrade(total) {
    if (total >= 90) return 'O';
    if (total >= 80) return 'A+';
    if (total >= 70) return 'A';
    if (total >= 60) return 'B+';
    if (total >= 50) return 'B';
    if (total >= 35) return 'C';
    return 'F';
}

function gradePillClass(g) {
    return { 
        O: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30', 
        'A+': 'bg-teal-500/20 text-teal-400 border border-teal-500/30', 
        A: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30', 
        'B+': 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30', 
        B: 'bg-purple-500/20 text-purple-400 border border-purple-500/30', 
        C: 'bg-amber-500/20 text-amber-400 border border-amber-500/30', 
        F: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
    }[g] ?? '';
}

function showToast(msg) {
    const el = document.createElement('div');
    el.className = 'fixed bottom-4 right-4 bg-rose-500 text-white px-6 py-3 rounded-xl shadow-lg transform translate-y-20 opacity-0 transition-all duration-300 z-50 flex items-center gap-2';
    el.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${msg}`;
    document.body.appendChild(el);
    
    setTimeout(() => {
        el.classList.remove('translate-y-20', 'opacity-0');
    }, 10);
    
    setTimeout(() => {
        el.classList.add('translate-y-20', 'opacity-0');
        setTimeout(() => el.remove(), 300);
    }, 3000);
}

function goTo(n) {
    document.getElementById(`step-${currentStep}`).classList.add('hidden');
    document.getElementById(`step-${currentStep}`).classList.remove('active', 'animate-fade-in-up');
    
    document.getElementById(`step-dot-${currentStep}`).classList.remove('active');
    document.getElementById(`step-dot-${currentStep}`).querySelector('.step-circle').classList.remove('bg-primary', 'text-white');
    
    if (n > currentStep) {
        document.getElementById(`step-dot-${currentStep}`).classList.add('done');
        document.getElementById(`step-dot-${currentStep}`).querySelector('.step-circle').classList.add('bg-indigo-500', 'text-white', 'border-indigo-500');
    } else {
        document.getElementById(`step-dot-${currentStep}`).classList.remove('done');
        document.getElementById(`step-dot-${currentStep}`).querySelector('.step-circle').classList.remove('bg-indigo-500', 'text-white', 'border-indigo-500');
    }
    
    currentStep = n;
    
    document.getElementById(`step-${currentStep}`).classList.remove('hidden');
    document.getElementById(`step-${currentStep}`).classList.add('active', 'animate-fade-in-up');
    
    document.getElementById(`step-dot-${currentStep}`).classList.add('active');
    document.getElementById(`step-dot-${currentStep}`).querySelector('.step-circle').classList.add('bg-primary', 'text-white');
    document.getElementById(`step-dot-${currentStep}`).querySelector('.step-circle').classList.remove('bg-indigo-500');
    
    updateStepLines();
}

function updateStepLines() {
    const progress = ((currentStep - 1) / 4) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
}

function setupSubjects() {
    const branch = document.getElementById('branch').value.trim();
    const tc = parseInt(document.getElementById('theoryCount').value) || 0;
    const lc = parseInt(document.getElementById('labCount').value) || 0;
    
    if (!branch) { showToast('Please enter your branch name.'); return; }
    if (tc + lc === 0) { showToast('Add at least one subject.'); return; }
    if (tc + lc > 20) { showToast('Max 20 subjects total.'); return; }
    
    cgpaState.branch = branch;
    cgpaState.theoryCount = tc;
    cgpaState.labCount = lc;
    
    buildTheoryFields();
    buildLabFields();
    
    if (tc > 0) goTo(2);
    else if (lc > 0) goTo(3);
    else goTo(4);
}

function buildTheoryFields() {
    const wrap = document.getElementById('theory-fields');
    wrap.innerHTML = '';
    for (let i = 0; i < cgpaState.theoryCount; i++) {
        wrap.innerHTML += `
        <div class="bg-darkBg/30 p-5 rounded-xl border border-glassBorder space-y-4">
            <h4 class="font-semibold text-indigo-400 flex items-center gap-2"><i class="fa-solid fa-book-open"></i> Theory Subject ${i+1}</h4>
            <div>
                <label class="text-xs text-slate-400 block mb-1">Subject Name</label>
                <input type="text" id="t-name-${i}" placeholder="e.g. Data Structures" class="w-full bg-darkBg/50 border border-glassBorder rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"/>
            </div>
            <div class="grid grid-cols-3 gap-3">
                <div>
                    <label class="text-xs text-slate-400 block mb-1">Assignment (20)</label>
                    <input type="number" id="t-asgn-${i}" min="0" max="20" placeholder="0-20" class="w-full bg-darkBg/50 border border-glassBorder rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"/>
                </div>
                <div>
                    <label class="text-xs text-slate-400 block mb-1">Mid-Sem (30)</label>
                    <input type="number" id="t-mid-${i}" min="0" max="30" placeholder="0-30" class="w-full bg-darkBg/50 border border-glassBorder rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"/>
                </div>
                <div>
                    <label class="text-xs text-slate-400 block mb-1">End-Sem (50)</label>
                    <input type="number" id="t-end-${i}" min="0" max="50" placeholder="0-50" class="w-full bg-darkBg/50 border border-glassBorder rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"/>
                </div>
            </div>
            <div>
                <label class="text-xs text-slate-400 block mb-1">Credit</label>
                <input type="number" id="t-cred-${i}" step="0.5" min="0.5" max="6" placeholder="e.g. 4" class="w-full bg-darkBg/50 border border-glassBorder rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"/>
            </div>
        </div>`;
    }
}

function collectTheory() {
    cgpaState.subjects = [];
    for (let i = 0; i < cgpaState.theoryCount; i++) {
        const name = document.getElementById(`t-name-${i}`)?.value.trim();
        const a = parseInt(document.getElementById(`t-asgn-${i}`)?.value) || 0;
        const m = parseInt(document.getElementById(`t-mid-${i}`)?.value) || 0;
        const e = parseInt(document.getElementById(`t-end-${i}`)?.value) || 0;
        const c = parseFloat(document.getElementById(`t-cred-${i}`)?.value);
        
        if (!name) { showToast(`Enter name for Theory Subject ${i+1}`); return; }
        if (a > 20 || m > 30 || e > 50 || a < 0 || m < 0 || e < 0) { showToast(`Check marks range for ${name}`); return; }
        if (!c || c <= 0) { showToast(`Enter valid credit for ${name}`); return; }
        
        cgpaState.subjects.push({ name, marks: a+m+e, credit: c, type: 'theory' });
    }
    
    if (cgpaState.labCount > 0) goTo(3);
    else goTo(4);
}

function buildLabFields() {
    const wrap = document.getElementById('lab-fields');
    wrap.innerHTML = '';
    for (let i = 0; i < cgpaState.labCount; i++) {
        wrap.innerHTML += `
        <div class="bg-darkBg/30 p-5 rounded-xl border border-glassBorder space-y-4">
            <h4 class="font-semibold text-sky-400 flex items-center gap-2"><i class="fa-solid fa-flask"></i> Lab ${i+1}</h4>
            <div>
                <label class="text-xs text-slate-400 block mb-1">Lab Name</label>
                <input type="text" id="l-name-${i}" placeholder="e.g. OS Lab" class="w-full bg-darkBg/50 border border-glassBorder rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500 transition-colors"/>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-xs text-slate-400 block mb-1">Total Marks (0–100)</label>
                    <input type="number" id="l-marks-${i}" min="0" max="100" placeholder="0–100" class="w-full bg-darkBg/50 border border-glassBorder rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500 transition-colors"/>
                </div>
                <div>
                    <label class="text-xs text-slate-400 block mb-1">Credit</label>
                    <input type="number" id="l-cred-${i}" step="0.5" min="0.5" max="4" placeholder="e.g. 2" class="w-full bg-darkBg/50 border border-glassBorder rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500 transition-colors"/>
                </div>
            </div>
        </div>`;
    }
}

function collectLabs() {
    const theoryPart = cgpaState.subjects.filter(s => s.type === 'theory');
    cgpaState.subjects = theoryPart;
    
    for (let i = 0; i < cgpaState.labCount; i++) {
        const name = document.getElementById(`l-name-${i}`)?.value.trim();
        const marks = parseInt(document.getElementById(`l-marks-${i}`)?.value) || 0;
        const credit = parseFloat(document.getElementById(`l-cred-${i}`)?.value);
        
        if (!name) { showToast(`Enter name for Lab ${i+1}`); return; }
        if (marks < 0 || marks > 100) { showToast(`Marks must be 0–100 for ${name}`); return; }
        if (!credit || credit <= 0) { showToast(`Enter valid credit for ${name}`); return; }
        
        cgpaState.subjects.push({ name, marks, credit, type: 'lab' });
    }
    goTo(4);
}

function toggleActivity() {
    const on = document.getElementById('hasActivity').checked;
    const fields = document.getElementById('activity-fields');
    if(on) {
        fields.classList.remove('hidden');
    } else {
        fields.classList.add('hidden');
    }
    document.getElementById('toggle-label').textContent = on ? 'Yes' : 'No';
}

function calculateResult() {
    const hasAct = document.getElementById('hasActivity').checked;
    
    cgpaState.subjects = cgpaState.subjects.filter(s => s.type !== 'activity');
    
    if (hasAct) {
        const actName = document.getElementById('activityName').value;
        const actMarks = parseInt(document.getElementById('activityMarks').value) || 0;
        const actCredit = parseFloat(document.getElementById('activityCredit').value);
        
        if (!actCredit || actCredit <= 0) { showToast('Enter valid credit for the activity.'); return; }
        if (actMarks < 0 || actMarks > 100) { showToast('Activity marks must be 0–100.'); return; }
        
        cgpaState.subjects.push({ name: actName, marks: actMarks, credit: actCredit, type: 'activity' });
    }
    
    renderResults();
    goTo(5);
}

function renderResults() {
    let totalCredit = 0, totalGP = 0;
    
    const rows = cgpaState.subjects.map((s, idx) => {
        const grade = calculateGrade(s.marks);
        const gp = gradePoint(grade);
        totalCredit += s.credit;
        totalGP += s.credit * gp;
        const delay = idx * 80;
        
        return `
        <div class="flex items-center justify-between bg-darkBg/50 p-3 rounded-xl border border-glassBorder animate-fade-in-up" style="animation-delay:${delay}ms; opacity:0; animation-fill-mode: forwards;">
            <div class="flex flex-col">
                <span class="text-white font-medium">${s.name}</span>
                <span class="text-xs text-slate-500">${s.marks}/100 &bull; ${s.credit}cr</span>
            </div>
            <span class="px-3 py-1 rounded-lg text-sm font-bold ${gradePillClass(grade)}">${grade}</span>
        </div>`;
    });

    const cgpa = totalCredit > 0 ? totalGP / totalCredit : 0;
    const cgpaFixed = cgpa.toFixed(2);

    document.getElementById('res-branch').textContent = cgpaState.branch;
    document.getElementById('res-credits').textContent = totalCredit.toFixed(1);
    document.getElementById('cgpa-value').textContent = cgpaFixed;

    const badge = document.getElementById('res-grade-badge');
    const overallGrade = calculateGrade(Math.round(cgpa * 10));
    badge.textContent = overallGrade;
    badge.className = `px-2.5 py-0.5 rounded text-xs font-bold ${gradePillClass(overallGrade)}`;

    const pct = Math.min(cgpa / 10, 1);
    const circ = 314.16;
    setTimeout(() => {
        document.getElementById('ring-progress').style.strokeDashoffset = circ * (1 - pct);
    }, 100);

    document.getElementById('grade-table').innerHTML = rows.join('');
    
    // Auto-update Target Planner
    document.getElementById('current-cgpa').value = cgpaFixed;
    calculateTarget();
}

function resetAll() {
    cgpaState = { branch:'', theoryCount:0, labCount:0, subjects:[] };
    document.getElementById('branch').value = '';
    document.getElementById('theoryCount').value = '';
    document.getElementById('labCount').value = '';
    document.getElementById('hasActivity').checked = false;
    document.getElementById('activity-fields').classList.add('hidden');
    document.getElementById('toggle-label').textContent = 'No';
    document.getElementById('ring-progress').style.strokeDashoffset = 314.16;
    
    document.querySelectorAll('.step-circle').forEach(s => s.classList.remove('bg-indigo-500', 'bg-primary', 'text-white', 'border-indigo-500'));
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active', 'done'));
    
    goTo(1);
}


function calculateTarget() {
    const target = parseFloat(document.getElementById('target-cgpa').value) || 0;
    const semsDone = parseInt(document.getElementById('sems-done').value) || 1;
    const currentCgpa = parseFloat(document.getElementById('current-cgpa').value) || 0;

    const needed = ((target * (semsDone + 1)) - (currentCgpa * semsDone)).toFixed(2);
    const neededEl = document.getElementById('needed-sgpa');
    
    if (needed > 10) {
        neededEl.textContent = 'Impossible (>10)';
        neededEl.className = 'text-2xl font-display font-bold text-rose-500';
    } else if (needed < 0) {
        neededEl.textContent = 'Already Achieved!';
        neededEl.className = 'text-2xl font-display font-bold text-emerald-400';
    } else {
        neededEl.textContent = needed;
        neededEl.className = 'text-2xl font-display font-bold text-emerald-400';
    }
}


// --- AI Analyzer Demo Logic ---
document.getElementById('btn-demo-analyze')?.addEventListener('click', () => {
    const btn = document.getElementById('btn-demo-analyze');
    const ogHtml = btn.innerHTML;
    
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Analyzing with Gemini...';
    btn.disabled = true;

    setTimeout(() => {
        document.getElementById('ai-upload-area').classList.add('hidden');
        const results = document.getElementById('ai-results');
        results.classList.remove('hidden');
        results.classList.add('animate-fade-in-up');
        
        btn.innerHTML = ogHtml;
        btn.disabled = false;
    }, 1500);
});


// --- Daily Hub Timer ---
function updateTimer() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const diff = tomorrow - now;

    const h = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
    const m = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, '0');
    const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');

    const cd = document.getElementById('countdown');
    if(cd) cd.textContent = `${h}:${m}:${s}`;
}


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if(savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        updateThemeIcons(false);
    } else {
        document.documentElement.classList.add('dark');
        updateThemeIcons(true);
    }
    if (document.getElementById('pyq-grid')) renderPYQs();
    if (document.getElementById('materials-grid')) renderMaterials();
    if (document.getElementById('doubts-container')) renderDoubts();
    if (document.getElementById('mcq-container')) renderMCQs();
    // renderCGPATable(); // Removed due to new Grade Wizard logic
    
    // Attach event listeners for Target Planner
    const targetCgpa = document.getElementById('target-cgpa');
    if (targetCgpa) targetCgpa.addEventListener('input', calculateTarget);
    
    const semsDone = document.getElementById('sems-done');
    if (semsDone) semsDone.addEventListener('input', calculateTarget);
    
    const currentCgpa = document.getElementById('current-cgpa');
    if (currentCgpa) currentCgpa.addEventListener('input', calculateTarget);
    
    // Attendance Tracker
    const clAtt = document.getElementById('classes-attended');
    if (clAtt) clAtt.addEventListener('input', calculateAttendance);
    const clTot = document.getElementById('classes-total');
    if (clTot) clTot.addEventListener('input', calculateAttendance);
    if(clAtt) calculateAttendance();

    // DSA Mark done
    const dsaBtn = document.getElementById('btn-dsa-done');
    if(dsaBtn) {
        dsaBtn.addEventListener('click', () => {
            dsaBtn.innerHTML = '<i class="fa-solid fa-check"></i> Completed';
            dsaBtn.classList.replace('text-slate-300', 'text-emerald-400');
            dsaBtn.classList.replace('border-glassBorder', 'border-emerald-500/50');
            dsaBtn.classList.add('bg-emerald-500/10');
        });
    }

    setInterval(updateTimer, 1000);
    updateTimer();
});


function calculateAttendance() {
    const attended = parseInt(document.getElementById('classes-attended')?.value) || 0;
    const total = parseInt(document.getElementById('classes-total')?.value) || 1;
    
    const perc = (attended / total) * 100;
    const percEl = document.getElementById('attendance-perc');
    const msgEl = document.getElementById('attendance-msg');
    
    if (percEl) percEl.textContent = perc.toFixed(1) + '%';
    
    if (msgEl) {
        if (perc >= 75) {
            msgEl.textContent = "Safe! You have above 75% attendance.";
            msgEl.className = "text-xs text-emerald-400 mt-1";
            percEl.className = "text-2xl font-display font-bold text-emerald-400";
        } else {
            // How many to attend to reach 75%?
            // (attended + x) / (total + x) = 0.75
            // attended + x = 0.75*total + 0.75*x
            // 0.25*x = 0.75*total - attended
            // x = 3*total - 4*attended
            const required = Math.ceil(3 * total - 4 * attended);
            msgEl.textContent = `Warning! Attend the next ${required} classes to reach 75%.`;
            msgEl.className = "text-xs text-rose-400 mt-1";
            percEl.className = "text-2xl font-display font-bold text-rose-400";
        }
    }
}
