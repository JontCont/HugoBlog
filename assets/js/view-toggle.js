// Hide broken images globally
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('img').forEach(function (img) {
        img.addEventListener('error', function () {
            this.style.display = 'none';
        });
    });
});

(function () {
    const STORAGE_KEY = 'article-view-mode';
    const list = document.getElementById('article-list');
    const buttons = document.querySelectorAll('.view-toggle__btn');
    if (!list || !buttons.length) return;

    function setView(mode) {
        list.classList.toggle('article-list--grid', mode === 'grid');
        buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.view === mode));
        try { localStorage.setItem(STORAGE_KEY, mode); } catch (_) {}
    }

    buttons.forEach(btn => btn.addEventListener('click', () => setView(btn.dataset.view)));

    // Restore saved preference
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'grid' || saved === 'list') setView(saved);
    } catch (_) {}
})();
