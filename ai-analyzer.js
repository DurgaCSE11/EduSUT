// js/ai-analyzer.js

// Helper to get a random key from the rotation
async function analyzePDF(file) {
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
        // Convert file to Base64 for the serverless function
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
        });
        reader.readAsDataURL(file);
        const pdfData = await base64Promise;

        // Call our secure Vercel Serverless Function
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pdfData, fileName: file.name })
        });

        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || 'Analysis failed');

        // Parse the AI response (Gemini returns a complex object)
        const aiResponse = JSON.parse(data.candidates[0].content.parts[0].text);
        renderResults(aiResponse);

    } catch (error) {
        console.error("AI Analysis failed:", error);
        alert("Analysis failed: " + error.message);
        uploadArea.classList.remove('hidden');
        resultsArea.classList.add('hidden');
    }
}

function renderResults(data) {
    const resultsArea = document.getElementById('ai-results');
    
    // Fallback if AI didn't return expected JSON
    const topics = data.topics || [
        { name: "Core Syllabus Topics", weight: "45%" },
        { name: "Problem Solving & Labs", weight: "30%" }
    ];
    const predictions = data.predictions || [
        "High likelihood of questions repeating from recent papers."
    ];

    resultsArea.innerHTML = `
        <div class="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg mb-6">
            <span class="text-sm font-medium"><i class="fa-solid fa-check-circle mr-2"></i> AI Analysis Complete</span>
            <button onclick="location.reload()" class="text-xs hover:text-emerald-300 underline">Analyze Another PDF</button>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
            <div class="glass-card p-6 rounded-2xl">
                <h3 class="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-chart-pie text-purple-400"></i> Topic Weightage
                </h3>
                <div class="space-y-4">
                    ${topics.map(t => `
                        <div>
                            <div class="flex justify-between text-xs text-slate-400 mb-1">
                                <span>${t.name}</span> <span>${t.weight}</span>
                            </div>
                            <div class="w-full bg-darkBg rounded-full h-2">
                                <div class="bg-purple-500 h-2 rounded-full" style="width: ${t.weight}"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="glass-card p-6 rounded-2xl border-emerald-500/30 bg-emerald-500/5">
                <h3 class="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-lightbulb text-emerald-400"></i> AI Predictions
                </h3>
                <ul class="space-y-3">
                    ${predictions.map(p => `
                        <li class="flex items-start gap-3 text-sm text-slate-300 bg-darkBg/50 p-3 rounded-lg border border-glassBorder">
                            <i class="fa-solid fa-bullseye text-emerald-400 mt-1"></i>
                            <span>${p}</span>
                        </li>
                    `).join('')}
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
