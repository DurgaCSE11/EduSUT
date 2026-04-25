// js/footer.js
// Modern Footer Injection for EduSUT

function injectFooter() {
    const mainElement = document.querySelector('main');
    if (!mainElement || document.getElementById('edusut-footer')) return;

    const footerHtml = `
    <footer id="edusut-footer" class="mt-20 py-16 px-6 md:px-12 border-t border-white/5 bg-white/[0.02] backdrop-blur-md rounded-t-[3rem] relative overflow-hidden">
        <!-- Background decorative elements -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            <!-- Brand & Subscribe -->
            <div class="lg:col-span-5 space-y-8">
                <div class="flex items-center gap-3">
                    <img src="logo.jpg" alt="Logo" class="w-12 h-12 rounded-full object-cover border border-white/10 shadow-lg shadow-primary/20">
                    <h2 class="text-3xl font-display font-bold text-white tracking-tight">EduSUT</h2>
                </div>
                
                <h3 class="text-5xl md:text-6xl font-display font-bold text-white leading-tight">
                    Learning is <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">calling.</span>
                </h3>

                <div class="relative max-w-md group">
                    <input type="email" placeholder="Enter your email" class="w-full bg-darkBg/50 border border-glassBorder rounded-full pl-6 pr-32 py-4 text-white focus:outline-none focus:border-primary transition-all backdrop-blur-sm">
                    <button class="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primaryHover text-white px-6 rounded-full font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center">
                        Subscribe
                    </button>
                </div>
            </div>

            <!-- Links Sections -->
            <div class="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                <div class="space-y-6">
                    <h4 class="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Resources</h4>
                    <ul class="space-y-4">
                        <li><a href="materials.html" class="text-slate-400 hover:text-white transition-colors">Study Materials</a></li>
                        <li><a href="pyq.html" class="text-slate-400 hover:text-white transition-colors">PYQ Repository</a></li>
                        <li><a href="ai.html" class="text-slate-400 hover:text-white transition-colors">AI Analyzer</a></li>
                        <li><a href="library.html" class="text-slate-400 hover:text-white transition-colors">Digital Library</a></li>
                    </ul>
                </div>

                <div class="space-y-6">
                    <h4 class="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Community</h4>
                    <ul class="space-y-4">
                        <li><a href="doubts.html" class="text-slate-400 hover:text-white transition-colors">Doubt Clearing</a></li>
                        <li><a href="alumni.html" class="text-slate-400 hover:text-white transition-colors">Alumni Network</a></li>
                        <li><a href="daily.html" class="text-slate-400 hover:text-white transition-colors">Daily Hub</a></li>
                        <li><a href="cgpa.html" class="text-slate-400 hover:text-white transition-colors">Grade Wizard</a></li>
                    </ul>
                </div>

                <div class="col-span-2 md:col-span-1 space-y-6">
                    <h4 class="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Connect</h4>
                    <div class="space-y-6">
                        <button class="w-full bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 border border-pink-500/20 py-3 px-6 rounded-full font-bold transition-all flex items-center justify-center gap-2 group">
                            <i class="fa-solid fa-circle text-[8px] animate-pulse"></i>
                            ABOUT THE PROJECT
                            <i class="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-50 group-hover:opacity-100 transition-opacity"></i>
                        </button>
                        <ul class="space-y-4">
                            <li><a href="#" class="text-slate-400 hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" class="text-slate-400 hover:text-white transition-colors">Contact Support</a></li>
                            <li><a href="#" class="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Bar -->
        <div class="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="text-sm text-slate-500">
                © ${new Date().getFullYear()} EduSUT. All rights reserved.
                <div class="mt-1 font-bold text-[10px] uppercase tracking-widest text-primary/60">MADE BY "TEAM EDUSUT"</div>
            </div>
            <div class="flex gap-8 text-sm">
                <a href="#" class="text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" class="text-slate-500 hover:text-white transition-colors">Terms of Service</a>
            </div>
        </div>
    </footer>

    <!-- Chat Toggle Button (Floating) -->
    <button class="fixed bottom-6 right-6 w-14 h-14 bg-pink-500 text-white rounded-full shadow-2xl shadow-pink-500/30 flex items-center justify-center hover:scale-110 transition-transform z-50">
        <i class="fa-solid fa-comment-dots text-xl"></i>
    </button>
    `;

    mainElement.insertAdjacentHTML('beforeend', footerHtml);
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
} else {
    injectFooter();
}
