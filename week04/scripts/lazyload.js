document.addEventListener('DOMContentLoaded', () => {
    // Add load handlers to animate images when they finish loading.
    const imgs = document.querySelectorAll('main img');

    imgs.forEach(img => {
        // If the image is already complete (cached), mark as loaded immediately
        if (img.complete && img.naturalWidth !== 0) {
            img.classList.add('is-loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
            img.addEventListener('error', () => img.classList.add('is-loaded'), { once: true });
        }
    });

    // Current year for footer
    const yearEl = document.getElementById('currentyear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Last modified date for footer (use document.lastModified)
    const lastEl = document.getElementById('lastModified');
    if (lastEl) {
        const lm = document.lastModified;
        lastEl.textContent = lm ? lm : 'Unknown';
    }
});