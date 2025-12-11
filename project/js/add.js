/**
 * add.js - Add Entry page functionality
 * Handles form submission and validation for adding new music entries
 */

// ================================================
// Initialization
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Add Entry page loaded');

    // Set up form
    initializeForm();

    // Set up event listeners
    setupEventListeners();

    // Display recently added entries
    displayRecentAdditions();
});

// ================================================
// Form Initialization
// ================================================

/**
 * Initialize form with current date and time
 */
function initializeForm() {
    const dateInput = document.getElementById('entryDate');
    const timeInput = document.getElementById('entryTime');

    // Set current date
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    dateInput.value = dateString;

    // Set current time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeInput.value = `${hours}:${minutes}`;

    console.log('Form initialized with current date and time');
}

// ================================================
// Event Listeners
// ================================================

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    const form = document.getElementById('addEntryForm');
    const resetBtn = document.getElementById('resetBtn');

    // Form submission
    form.addEventListener('submit', handleFormSubmit);

    // Reset button
    resetBtn.addEventListener('click', handleFormReset);

    // Real-time validation on input
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
    });

    // File upload listeners
    setupFileUpload();
}

// ================================================
// Form Submission
// ================================================

/**
 * Handle form submission
 * @param {Event} event - Submit event
 */
async function handleFormSubmit(event) {
    event.preventDefault();

    console.log('Form submitted');

    // Get form data
    const formData = getFormData();

    // Validate entry
    const validation = validateEntry(formData);

    if (!validation.valid) {
        // Show validation errors
        showMessage(
            validation.errors.join('. '),
            'error',
            document.getElementById('messageContainer')
        );
        return;
    }

    // Save to localStorage
    const success = addEntry(formData);

    if (success) {
        // Show success message
        showMessage(
            `Successfully added "${formData.song}" by ${formData.artist}!`,
            'success',
            document.getElementById('messageContainer')
        );

        // Reset form
        document.getElementById('addEntryForm').reset();
        initializeForm();

        // Update recent additions
        displayRecentAdditions();

        // Scroll to top to see message
        window.scrollTo({ top: 0, behavior: 'smooth' });

        console.log('Entry added successfully');
    } else {
        showMessage(
            'Failed to save entry. Please try again.',
            'error',
            document.getElementById('messageContainer')
        );
    }
}

/**
 * Get data from form
 * @returns {Object} Entry object
 */
function getFormData() {
    const songTitle = document.getElementById('songTitle').value.trim();
    const artistName = document.getElementById('artistName').value.trim();
    const albumName = document.getElementById('albumName').value.trim();
    const playCount = parseInt(document.getElementById('playCount').value);
    const entryDate = document.getElementById('entryDate').value;
    const entryTime = document.getElementById('entryTime').value;

    // Combine date and time
    const datetime = `${entryDate}T${entryTime}`;

    return {
        song: songTitle,
        artist: artistName,
        album: albumName || 'Unknown Album',
        plays: playCount,
        datetime: datetime
    };
}

// ================================================
// Form Reset
// ================================================

/**
 * Handle form reset
 */
function handleFormReset() {
    // Reset form
    document.getElementById('addEntryForm').reset();

    // Reinitialize with current date/time
    initializeForm();

    // Clear any messages
    const messageContainer = document.getElementById('messageContainer');
    if (messageContainer) {
        messageContainer.innerHTML = '';
    }

    // Remove any field error states
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });

    console.log('Form reset');
}

// ================================================
// Validation
// ================================================

/**
 * Validate individual field on blur
 * @param {HTMLInputElement} field - Input field to validate
 */
function validateField(field) {
    if (field.value.trim() === '') {
        field.style.borderColor = 'var(--error)';
    } else {
        field.style.borderColor = 'var(--success)';
    }
}

// ================================================
// Recent Additions Display
// ================================================

/**
 * Display recently added entries from localStorage
 */
function displayRecentAdditions() {
    const localData = getLocalStorageData();

    if (localData.length === 0) {
        // Hide the section if no recent additions
        document.getElementById('recentAdditions').classList.add('hidden');
        return;
    }

    // Show the section
    document.getElementById('recentAdditions').classList.remove('hidden');

    // Get last 3 additions
    const recent = localData.slice(-3).reverse();

    // Generate HTML
    const html = recent.map(entry => `
        <li class="recent-play-item">
            <strong>${escapeHtml(entry.song)}</strong>
            <div class="artist">by ${escapeHtml(entry.artist)}</div>
            <div class="meta">
                <span>🎵 ${formatNumber(entry.plays)} plays</span>
                ${entry.album && entry.album !== 'Unknown Album' ? `<span>💿 ${escapeHtml(entry.album)}</span>` : ''}
                <span>📅 ${formatDateTime(entry.datetime)}</span>
            </div>
        </li>
    `).join('');

    document.getElementById('recentAdditionsList').innerHTML = html;
}

// ================================================
// Utility Functions
// ================================================

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show message to user
 * @param {string} message - Message text
 * @param {string} type - Message type ('success' or 'error')
 * @param {HTMLElement} container - Container element
 */
function showMessage(message, type, container) {
    if (!container) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    // Remove existing messages
    container.innerHTML = '';

    // Add new message
    container.appendChild(messageDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.classList.add('hidden');
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// ================================================
// File Upload Functionality
// ================================================

/**
 * Set up file upload event listeners
 */
function setupFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const showFormatBtn = document.getElementById('showFormatBtn');
    const formatInstructions = document.getElementById('formatInstructions');

    // Enable upload button when file is selected
    fileInput.addEventListener('change', (e) => {
        uploadBtn.disabled = !e.target.files.length;
    });

    // Handle upload button click
    uploadBtn.addEventListener('click', handleFileUpload);

    // Toggle format instructions
    showFormatBtn.addEventListener('click', () => {
        formatInstructions.classList.toggle('hidden');
    });
}

/**
 * Handle file upload and processing
 */
async function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        showMessage('Please select a file', 'error', document.getElementById('uploadMessageContainer'));
        return;
    }

    // Show loading state
    const uploadBtn = document.getElementById('uploadBtn');
    const originalText = uploadBtn.textContent;
    uploadBtn.textContent = 'Processing...';
    uploadBtn.disabled = true;

    try {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        let entries = [];

        if (fileExtension === 'json') {
            entries = await parseJSONFile(file);
        } else if (fileExtension === 'csv') {
            entries = await parseCSVFile(file);
        } else {
            throw new Error('Unsupported file format. Please use JSON or CSV.');
        }

        // Validate and import entries
        const result = importEntries(entries);

        // Show results
        displayImportSummary(result);

        // Clear file input
        fileInput.value = '';
        uploadBtn.disabled = true;

        // Update recent additions
        displayRecentAdditions();

        // Scroll to summary
        document.getElementById('importSummary').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('File upload error:', error);
        showMessage(
            `Error: ${error.message}`,
            'error',
            document.getElementById('uploadMessageContainer')
        );
    } finally {
        uploadBtn.textContent = originalText;
        uploadBtn.disabled = false;
    }
}

/**
 * Parse JSON file
 * @param {File} file - JSON file to parse
 * @returns {Promise<Array>} Array of entries
 */
function parseJSONFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // Ensure it's an array
                if (!Array.isArray(data)) {
                    reject(new Error('JSON file must contain an array of entries'));
                    return;
                }

                resolve(data);
            } catch (error) {
                reject(new Error('Invalid JSON format: ' + error.message));
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsText(file);
    });
}

/**
 * Parse CSV file
 * @param {File} file - CSV file to parse
 * @returns {Promise<Array>} Array of entries
 */
function parseCSVFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const text = e.target.result;
                const lines = text.split('\n').filter(line => line.trim());

                if (lines.length < 2) {
                    reject(new Error('CSV file must have a header row and at least one data row'));
                    return;
                }

                // Parse header
                const headers = parseCSVLine(lines[0]);

                // Validate required headers
                const requiredHeaders = ['song', 'artist', 'plays', 'datetime'];
                const missingHeaders = requiredHeaders.filter(h =>
                    !headers.some(header => header.toLowerCase() === h)
                );

                if (missingHeaders.length > 0) {
                    reject(new Error(`CSV missing required headers: ${missingHeaders.join(', ')}`));
                    return;
                }

                // Parse data rows
                const entries = [];
                for (let i = 1; i < lines.length; i++) {
                    const values = parseCSVLine(lines[i]);

                    if (values.length === 0) continue; // Skip empty lines

                    const entry = {};
                    headers.forEach((header, index) => {
                        const key = header.toLowerCase().trim();
                        entry[key] = values[index] ? values[index].trim() : '';
                    });

                    // Convert plays to number
                    if (entry.plays) {
                        entry.plays = parseInt(entry.plays);
                    }

                    entries.push(entry);
                }

                resolve(entries);
            } catch (error) {
                reject(new Error('Invalid CSV format: ' + error.message));
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsText(file);
    });
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
                // Escaped quote
                currentValue += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            // End of value
            values.push(currentValue);
            currentValue = '';
        } else {
            currentValue += char;
        }
    }

    // Add last value
    values.push(currentValue);

    return values;
}

/**
 * Import entries into localStorage
 * @param {Array} entries - Array of entry objects
 * @returns {Object} Import result statistics
 */
function importEntries(entries) {
    const result = {
        total: entries.length,
        successful: 0,
        failed: 0,
        errors: []
    };

    const localData = getLocalStorageData();

    entries.forEach((entry, index) => {
        // Validate entry
        const validation = validateEntry(entry);

        if (validation.valid) {
            // Ensure album field exists
            if (!entry.album || entry.album.trim() === '') {
                entry.album = 'Unknown Album';
            }

            localData.push(entry);
            result.successful++;
        } else {
            result.failed++;
            result.errors.push({
                line: index + 2, // +2 for header and 0-index
                entry: entry,
                errors: validation.errors
            });
        }
    });

    // Save updated data
    if (result.successful > 0) {
        saveData(localData);
    }

    return result;
}

/**
 * Display import summary
 * @param {Object} result - Import result object
 */
function displayImportSummary(result) {
    const summarySection = document.getElementById('importSummary');
    const summaryContent = document.getElementById('importSummaryContent');

    summarySection.classList.remove('hidden');

    let html = `
        <p style="font-size: 1.1rem;">
            <strong style="color: var(--success);">✓ ${result.successful}</strong> entries imported successfully<br>
            ${result.failed > 0 ? `<strong style="color: var(--error);">✗ ${result.failed}</strong> entries failed` : ''}
        </p>
        
        <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
            <a href="index.html" class="btn" style="display: inline-block;">View Statistics</a>
            <a href="charts.html" class="btn" style="display: inline-block;">View Charts</a>
        </div>
    `;

    if (result.errors.length > 0) {
        html += `
            <details style="margin-top: 1rem;">
                <summary style="cursor: pointer; color: var(--accent);">View Errors (${result.errors.length})</summary>
                <ul style="margin-top: 0.5rem; padding-left: 1.5rem; color: var(--text-secondary);">
        `;

        result.errors.slice(0, 10).forEach(error => {
            html += `
                <li style="margin-bottom: 0.5rem;">
                    <strong>Row ${error.line}:</strong> ${error.errors.join(', ')}
                    ${error.entry.song ? `(${escapeHtml(error.entry.song)})` : ''}
                </li>
            `;
        });

        if (result.errors.length > 10) {
            html += `<li><em>...and ${result.errors.length - 10} more errors</em></li>`;
        }

        html += `
                </ul>
            </details>
        `;
    }

    summaryContent.innerHTML = html;

    // Show success message
    if (result.successful > 0) {
        showMessage(
            `Successfully imported ${result.successful} entries!`,
            'success',
            document.getElementById('uploadMessageContainer')
        );
    }
}

console.log('add.js loaded successfully');
