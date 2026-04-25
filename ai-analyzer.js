// Gemini AI Configuration
// ADD YOUR API KEYS HERE IN THE ARRAY
const GEMINI_API_KEYS = [
    "AIzaSyCBaLsfrh1jNEWCG6ILtqOrvH_suD2w0Mw",
    "AIzaSyC7Jq4ewhAWYJBDb9QG47IHQWAUVgbm45I",
    "AIzaSyCP3n83JqzbVMKS3kY-y33zuKKXAhvJJCg"
];

// Helper to get a random key from the rotation
function getApiKey() {
    const key = GEMINI_API_KEYS[Math.floor(Math.random() * GEMINI_API_KEYS.length)];
    if (key.startsWith("YOUR_API_KEY")) return null;
    return key;
}

async function analyzePDF(file) {
    const apiKey = getApiKey();
    if (!apiKey) {
        alert("Please set your Gemini API keys in js/ai-analyzer.js");
        return;
    }

    const resultsArea = document.getElementById('ai-results');
    const uploadArea = document.getElementById('ai-upload-area');

    uploadArea.classList.add('hidden');
    resultsArea.classList.remove('hidden');
    resultsArea.innerHTML = `
        <div class="p-10 text-center">
            <i class="fa-solid fa-spinner fa-spin text-4xl text-emerald-500 mb-4"></i>
            <p class="text-xl font-bold text-white">Gemini is analyzing your PDF...</p>
            <p class="text-slate-400">Performing deep scan of topics and predicted questions.</p>
        </div>`;

    try {
        // Simulated AI logic (In production, use fetch with apiKey)
        await new Promise(resolve => setTimeout(resolve, 2500));
        renderResults();
    } catch (error) {
        console.error("AI Analysis failed:", error);
        alert("Analysis failed. Please check your API keys or file format.");
        uploadArea.classList.remove('hidden');
        resultsArea.classList.add('hidden');
    }
}

function renderResults() {
    const resultsArea = document.getElementById('ai-results');
    resultsArea.innerHTML = `
        <div class="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg mb-6">
            <span class="text-sm font-medium"><i class="fa-solid fa-check-circle mr-2"></i> AI Analysis Complete</span>
            <button onclick="location.reload()" class="text-xs hover:text-emerald-300 underline">Analyze Another PDF</button>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
            <div class="glass-card p-6 rounded-2xl">
                <h3 class="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2"><i class="fa-solid fa-chart-pie text-purple-400"></i> Topic Weightage</h3>
                <div class="space-y-4">
                    <div>
                        <div class="flex justify-between text-xs text-slate-400 mb-1"><span>Core Syllabus Topics</span> <span>45%</span></div>
                        <div class="w-full bg-darkBg rounded-full h-2"><div class="bg-purple-500 h-2 rounded-full" style="width: 45%"></div></div>
                    </div>
                    <div>
                        <div class="flex justify-between text-xs text-slate-400 mb-1"><span>Problem Solving & Labs</span> <span>30%</span></div>
                        <div class="w-full bg-darkBg rounded-full h-2"><div class="bg-indigo-500 h-2 rounded-full" style="width: 30%"></div></div>
                    </div>
                </div>
            </div>

            <div class="glass-card p-6 rounded-2xl border-emerald-500/30 bg-emerald-500/5">
                <h3 class="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2"><i class="fa-solid fa-lightbulb text-emerald-400"></i> AI Predictions</h3>
                <ul class="space-y-3">
                    <li class="flex items-start gap-3 text-sm text-slate-300 bg-darkBg/50 p-3 rounded-lg border border-glassBorder">
                        <i class="fa-solid fa-bullseye text-emerald-400 mt-1"></i>
                        <span>High likelihood of questions repeating from the 2022 and 2023 papers.</span>
                    </li>
                </ul>
            </div>
        </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('ai-file-input');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                analyzePDF(e.target.files[0]);
            }
        });
    }
});
