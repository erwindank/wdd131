/**
 * charts.js - Charts page functionality
 * Handles rendering of Top 10, Top 20, and Top 100 charts
 */

// Global data variable
let chartsData = [];
let currentChart = 10; // Default to Top 10

// ================================================
// Initialization
// ================================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Charts page loaded');

    try {
        // Load data
        chartsData = await loadData();
        console.log(`=== CHARTS PAGE DATA LOADED ===`);
        console.log(`Total entries: ${chartsData.length}`);
        console.log('Sample entries:', chartsData.slice(0, 3));

        if (chartsData.length === 0) {
            console.error('No data loaded for charts!');
            showChartError();
            return;
        }

        // Set up event listeners for chart buttons
        setupChartControls();

        // Display initial chart (Top 10)
        renderChart(10);

    } catch (error) {
        console.error('Error initializing charts page:', error);
        showChartError();
    }
});

// ================================================
// Chart Controls
// ================================================

/**
 * Set up event listeners for chart control buttons
 */
function setupChartControls() {
    const buttons = document.querySelectorAll('.chart-btn');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            e.target.classList.add('active');

            // Get chart size from data attribute
            const chartSize = parseInt(e.target.dataset.chart);
            currentChart = chartSize;

            // Render the selected chart
            renderChart(chartSize);
        });
    });
}

// ================================================
// Chart Rendering
// ================================================

/**
 * Render a chart with specified number of songs
 * @param {number} limit - Number of songs to display (10, 20, or 100)
 */
function renderChart(limit) {
    const displayElement = document.getElementById('chartDisplay');

    if (!displayElement) {
        console.error('Chart display element not found');
        return;
    }

    // Show loading state
    displayElement.innerHTML = '<div class="loading">Generating chart</div>';

    // Get sorted songs
    const topSongs = sortSongsByPlays(chartsData, limit);

    console.log(`Rendering chart with ${topSongs.length} songs (limit: ${limit})`);
    console.log('Top 3 songs:', topSongs.slice(0, 3));

    if (topSongs.length === 0) {
        console.error('sortSongsByPlays returned 0 songs!');
        displayElement.innerHTML = `
            <div class="message">
                <p>No songs to display yet. <a href="add.html">Add some entries</a> to see your charts!</p>
            </div>
        `;
        return;
    }

    // Generate chart HTML
    const chartHTML = generateChartTable(topSongs);

    // Display with a small delay for smooth transition
    setTimeout(() => {
        displayElement.innerHTML = chartHTML;
    }, 100);
}

/**
 * Generate HTML table for the chart
 * @param {Array} songs - Array of song objects
 * @returns {string} HTML string for the table
 */
function generateChartTable(songs) {
    // Generate table rows using template literals
    const rows = songs.map((song, index) => {
        const rank = index + 1;
        return `
            <tr>
                <td class="rank">#${rank}</td>
                <td>
                    <div class="song-title">${escapeHtml(song.song)}</div>
                    <div class="artist-name">${escapeHtml(song.artist)}</div>
                </td>
                <td class="playcount">${formatNumber(song.plays)}</td>
            </tr>
        `;
    }).join('');

    // Return complete table HTML
    return `
        <table class="chart-table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Song / Artist</th>
                    <th>Plays</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
        <p style="text-align: center; margin-top: 1rem; color: var(--text-secondary);">
            Showing ${songs.length} of ${chartsData.length} total entries
        </p>
    `;
}

// ================================================
// Utility Functions
// ================================================

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

/**
 * Show error message when chart fails to load
 */
function showChartError() {
    const displayElement = document.getElementById('chartDisplay');
    if (displayElement) {
        displayElement.innerHTML = `
            <div class="message error">
                <p>Error loading charts. Please <a href="charts.html">refresh the page</a> or try again later.</p>
            </div>
        `;
    }
}

// ================================================
// Search/Filter Functions (Optional Enhancement)
// ================================================

/**
 * Filter charts by artist name
 * @param {string} searchTerm - Artist name to search for
 */
function filterChartsByArtist(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        renderChart(currentChart);
        return;
    }

    const filtered = filterByArtist(chartsData, searchTerm);
    const topFiltered = sortSongsByPlays(filtered, currentChart);

    const displayElement = document.getElementById('chartDisplay');
    if (displayElement) {
        displayElement.innerHTML = `
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                Filtered by artist: <strong>${escapeHtml(searchTerm)}</strong>
                <button onclick="clearFilter()" style="margin-left: 1rem;">Clear Filter</button>
            </p>
            ${generateChartTable(topFiltered)}
        `;
    }
}

/**
 * Clear any active filters
 */
function clearFilter() {
    renderChart(currentChart);
}

console.log('charts.js loaded successfully');
