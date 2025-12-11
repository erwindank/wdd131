/**
 * main.js - Core functions for My 2025 Music Listening Charts
 * Handles data loading, storage, and shared utility functions
 */

// ================================================
// Constants
// ================================================

const STORAGE_KEY = 'musicListeningData2025';
const JSON_DATA_PATH = 'data/2025.json';
const CSV_DATA_PATH = 'data/scrobbles-erwindank-1765486344.csv';

// ================================================
// Data Loading and Storage Functions
// ================================================

/**
 * Load data from JSON/CSV files and localStorage
 * Merges all sources into a single dataset
 * @returns {Promise<Array>} Combined array of listening data
 */
async function loadData() {
    let fileData = [];

    try {
        // Try loading JSON file first
        try {
            const jsonResponse = await fetch(JSON_DATA_PATH);
            if (jsonResponse.ok) {
                const jsonData = await jsonResponse.json();
                fileData = [...fileData, ...jsonData];
                console.log(`Loaded ${jsonData.length} entries from JSON file`);
            }
        } catch (jsonError) {
            console.log('JSON file not loaded:', jsonError.message);
        }

        // Try loading CSV file
        try {
            const csvResponse = await fetch(CSV_DATA_PATH);
            if (csvResponse.ok) {
                const csvText = await csvResponse.text();
                const csvData = parseCSVText(csvText);
                fileData = [...fileData, ...csvData];
                console.log(`Loaded ${csvData.length} entries from CSV file`);
            }
        } catch (csvError) {
            console.log('CSV file not loaded:', csvError.message);
        }

        // Load data from localStorage
        const localData = getLocalStorageData();

        // Merge all datasets
        const combinedData = [...fileData, ...localData];

        console.log(`Total loaded: ${fileData.length} from files + ${localData.length} from localStorage = ${combinedData.length} total entries`);

        return combinedData;
    } catch (error) {
        console.error('Error loading data:', error);

        // Fallback to localStorage only if all files fail
        return getLocalStorageData();
    }
}

/**
 * Parse CSV text into array of objects
 * @param {string} csvText - CSV text content
 * @returns {Array} Array of entry objects
 */
function parseCSVText(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
        return [];
    }

    // Parse header
    const headers = parseCSVLine(lines[0]);

    // Parse data rows
    const entries = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);

        if (values.length === 0) continue;

        const entry = {};
        headers.forEach((header, index) => {
            const key = header.toLowerCase().trim();
            entry[key] = values[index] ? values[index].trim() : '';
        });

        // Convert plays to number
        if (entry.plays) {
            entry.plays = parseInt(entry.plays);
        }

        // Ensure album exists
        if (!entry.album || entry.album.trim() === '') {
            entry.album = 'Unknown Album';
        }

        entries.push(entry);
    }

    return entries;
}

/**
 * Parse a CSV line, handling quoted values
 * @param {string} line - CSV line to parse
 * @returns {Array<string>} Array of values
 */
function parseCSVLine(line) {
    const values = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                currentValue += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            values.push(currentValue);
            currentValue = '';
        } else {
            currentValue += char;
        }
    }

    values.push(currentValue);
    return values;
}

/**
 * Get data from localStorage
 * @returns {Array} Array of listening entries
 */
function getLocalStorageData() {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
        console.error('Error reading localStorage:', error);
        return [];
    }
}

/**
 * Save data to localStorage
 * @param {Array} data - Array of listening entries to save
 * @returns {boolean} Success status
 */
function saveData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log(`Saved ${data.length} entries to localStorage`);
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

/**
 * Add a new entry to localStorage
 * @param {Object} entry - New listening entry to add
 * @returns {boolean} Success status
 */
function addEntry(entry) {
    const localData = getLocalStorageData();
    localData.push(entry);
    return saveData(localData);
}

// ================================================
// Data Processing Functions
// ================================================

/**
 * Calculate statistics from the listening data
 * @param {Array} data - Array of listening entries
 * @returns {Object} Statistics object
 */
function getStats(data) {
    if (!data || data.length === 0) {
        return {
            totalPlays: 0,
            uniqueSongs: 0,
            uniqueArtists: 0,
            totalEntries: 0
        };
    }

    // Calculate total plays
    const totalPlays = data.reduce((sum, entry) => sum + (entry.plays || 0), 0);

    // Calculate unique songs
    const uniqueSongsSet = new Set(data.map(entry =>
        `${entry.song.toLowerCase()}-${entry.artist.toLowerCase()}`
    ));
    const uniqueSongs = uniqueSongsSet.size;

    // Calculate unique artists
    const uniqueArtistsSet = new Set(data.map(entry =>
        entry.artist.toLowerCase()
    ));
    const uniqueArtists = uniqueArtistsSet.size;

    // Total entries
    const totalEntries = data.length;

    return {
        totalPlays,
        uniqueSongs,
        uniqueArtists,
        totalEntries
    };
}

/**
 * Aggregate song data by combining entries with same song/artist
 * @param {Array} data - Array of listening entries
 * @returns {Array} Array of aggregated songs with total plays
 */
function aggregateSongs(data) {
    const songMap = new Map();

    data.forEach(entry => {
        const key = `${entry.song.toLowerCase()}-${entry.artist.toLowerCase()}`;

        if (songMap.has(key)) {
            // Add to existing entry
            const existing = songMap.get(key);
            existing.plays += entry.plays;
        } else {
            // Create new entry
            songMap.set(key, {
                song: entry.song,
                artist: entry.artist,
                album: entry.album || 'Unknown Album',
                plays: entry.plays,
                datetime: entry.datetime
            });
        }
    });

    return Array.from(songMap.values());
}

/**
 * Sort songs by play count (descending)
 * @param {Array} data - Array of listening entries
 * @param {number} limit - Optional limit for number of results
 * @returns {Array} Sorted array of songs
 */
function sortSongsByPlays(data, limit = null) {
    // First aggregate the songs
    const aggregated = aggregateSongs(data);

    // Sort by plays descending
    const sorted = aggregated.sort((a, b) => b.plays - a.plays);

    // Apply limit if specified
    return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Get recent plays (sorted by datetime)
 * @param {Array} data - Array of listening entries
 * @param {number} limit - Number of recent entries to return
 * @returns {Array} Array of recent entries
 */
function getRecentPlays(data, limit = 5) {
    return data
        .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
        .slice(0, limit);
}

/**
 * Filter songs by artist
 * @param {Array} data - Array of listening entries
 * @param {string} artistName - Artist name to filter by
 * @returns {Array} Filtered array
 */
function filterByArtist(data, artistName) {
    return data.filter(entry =>
        entry.artist.toLowerCase().includes(artistName.toLowerCase())
    );
}

/**
 * Filter songs by date range
 * @param {Array} data - Array of listening entries
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Array} Filtered array
 */
function filterByDateRange(data, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return data.filter(entry => {
        const entryDate = new Date(entry.datetime);
        return entryDate >= start && entryDate <= end;
    });
}

// ================================================
// Formatting Functions
// ================================================

/**
 * Format datetime for display
 * @param {string} datetime - ISO datetime string
 * @returns {string} Formatted datetime
 */
function formatDateTime(datetime) {
    try {
        const date = new Date(datetime);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return datetime;
    }
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    return num.toLocaleString('en-US');
}

/**
 * Validate entry data
 * @param {Object} entry - Entry object to validate
 * @returns {Object} Validation result {valid: boolean, errors: Array}
 */
function validateEntry(entry) {
    const errors = [];

    if (!entry.song || entry.song.trim() === '') {
        errors.push('Song title is required');
    }

    if (!entry.artist || entry.artist.trim() === '') {
        errors.push('Artist name is required');
    }

    if (!entry.plays || entry.plays < 1) {
        errors.push('Play count must be at least 1');
    }

    if (!entry.datetime) {
        errors.push('Date and time are required');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// ================================================
// Utility Functions
// ================================================

/**
 * Show a message to the user
 * @param {string} message - Message text
 * @param {string} type - Message type ('success' or 'error')
 * @param {HTMLElement} container - Container element for the message
 */
function showMessage(message, type, container) {
    if (!container) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    // Remove any existing messages
    const existingMessages = container.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Add new message
    container.insertBefore(messageDiv, container.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.classList.add('hidden');
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

/**
 * Get top artists by total plays
 * @param {Array} data - Array of listening entries
 * @param {number} limit - Number of top artists to return
 * @returns {Array} Array of artist objects with total plays
 */
function getTopArtists(data, limit = 10) {
    const artistMap = new Map();

    data.forEach(entry => {
        const artistKey = entry.artist.toLowerCase();

        if (artistMap.has(artistKey)) {
            const existing = artistMap.get(artistKey);
            existing.plays += entry.plays;
        } else {
            artistMap.set(artistKey, {
                artist: entry.artist,
                plays: entry.plays
            });
        }
    });

    return Array.from(artistMap.values())
        .sort((a, b) => b.plays - a.plays)
        .slice(0, limit);
}

// ================================================
// Export for ES6 modules (if needed)
// ================================================

// If using modules, uncomment these exports:
// export {
//     loadData,
//     saveData,
//     addEntry,
//     getStats,
//     sortSongsByPlays,
//     getRecentPlays,
//     filterByArtist,
//     filterByDateRange,
//     formatDateTime,
//     formatNumber,
//     validateEntry,
//     showMessage,
//     getTopArtists
// };

console.log('main.js loaded successfully');
