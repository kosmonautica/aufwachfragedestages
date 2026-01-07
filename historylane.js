// Version
const VERSION = 'v1.3.0';

// GitHub data source
const GITHUB_URL = 'https://raw.githubusercontent.com/kosmonautica/Aufwachfrage/main/README.md';

// DOM elements
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');
const tableContainer = document.getElementById('tableContainer');
const tableBody = document.getElementById('tableBody');
const versionElement = document.getElementById('version');
const daySelect = document.getElementById('daySelect');
const monthSelect = document.getElementById('monthSelect');
const loadDateButton = document.getElementById('loadDateButton');
const resetButton = document.getElementById('resetButton');
const previousDay = document.getElementById('previousDay');
const nextDay = document.getElementById('nextDay');

// Track currently displayed day/month (as DD.MM string)
let currentDisplayedDayMonth = getCurrentDayMonth();

/**
 * Get current day and month in DD.MM format
 */
function getCurrentDayMonth() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${day}.${month}`;
}

/**
 * Increment day/month by one day
 * @param {String} dayMonth - DD.MM format
 * @returns {String} Next day in DD.MM format
 */
function incrementDay(dayMonth) {
    const [day, month] = dayMonth.split('.').map(Number);
    const currentYear = new Date().getFullYear(); // Use current year for calculation
    const date = new Date(currentYear, month - 1, day);
    date.setDate(date.getDate() + 1);
    const newDay = String(date.getDate()).padStart(2, '0');
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    return `${newDay}.${newMonth}`;
}

/**
 * Decrement day/month by one day
 * @param {String} dayMonth - DD.MM format
 * @returns {String} Previous day in DD.MM format
 */
function decrementDay(dayMonth) {
    const [day, month] = dayMonth.split('.').map(Number);
    const currentYear = new Date().getFullYear(); // Use current year for calculation
    const date = new Date(currentYear, month - 1, day);
    date.setDate(date.getDate() - 1);
    const newDay = String(date.getDate()).padStart(2, '0');
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    return `${newDay}.${newMonth}`;
}

/**
 * Get maximum days for a given month
 * @param {Number} month - Month number (1-12)
 * @returns {Number} Number of days in the month
 */
function getDaysInMonth(month) {
    const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysPerMonth[month - 1] || 31;
}

/**
 * Update day select options based on selected month
 * Preserves the currently selected day if it's valid for the new month
 */
function updateDayOptions() {
    const selectedMonth = parseInt(monthSelect.value) || new Date().getMonth() + 1;
    const maxDays = getDaysInMonth(selectedMonth);
    const previouslySelectedDay = daySelect.value; // Save current selection

    // Clear day select
    daySelect.innerHTML = '<option value="">Tag</option>';

    // Add day options
    for (let day = 1; day <= maxDays; day++) {
        const option = document.createElement('option');
        option.value = String(day).padStart(2, '0');
        option.textContent = String(day).padStart(2, '0');
        daySelect.appendChild(option);
    }

    // Restore previously selected day if it's still valid, otherwise reset
    if (previouslySelectedDay && previouslySelectedDay !== '') {
        const dayNum = parseInt(previouslySelectedDay);
        if (dayNum <= maxDays) {
            daySelect.value = previouslySelectedDay; // Valid - restore it
        }
        // If invalid (e.g., 31st for February), leave it unselected
    }
}

/**
 * Update date picker to show the current displayed day/month
 */
function updateDatePicker() {
    const [day, month] = currentDisplayedDayMonth.split('.');
    monthSelect.value = month;
    updateDayOptions();
    daySelect.value = day;
}

/**
 * Parse Markdown table from GitHub README
 * Expected format: | Datum | Aufwachfrage | Thread on X/LinkedIn |
 */
function parseMarkdownTable(markdown) {
    const questions = [];
    const lines = markdown.split('\n');
    let inTable = false;

    for (let line of lines) {
        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
            // Skip header row (contains "Datum" AND is a header, not a date like "01.01.2024")
            if ((line.includes('Datum') || line.includes('Date')) && !line.match(/\d{2}\.\d{2}\.\d{4}/)) {
                inTable = true;
                continue;
            }

            // Skip separator row (contains ---)
            if (line.includes('---')) {
                continue;
            }

            if (inTable) {
                // Split by pipe and clean up
                const columns = line.split('|')
                    .map(col => col.trim())
                    .filter(col => col !== '');

                // We need at least 2 columns: date and question
                if (columns.length >= 2) {
                    const date = columns[0];
                    const question = columns[1];

                    // Only add if both are not empty
                    if (date && question) {
                        questions.push({ date, question });
                    }
                }
            }
        }
    }

    return questions;
}

/**
 * Filter questions by day and month (DD.MM)
 * @param {Array} questions - All questions
 * @param {String} dayMonth - Target day/month in DD.MM format
 * @returns {Array} Filtered questions
 */
function filterQuestionsByDayMonth(questions, dayMonth) {
    return questions.filter(q => {
        // Extract DD.MM from DD.MM.YYYY
        const dateParts = q.date.split('.');
        if (dateParts.length >= 2) {
            const questionDayMonth = `${dateParts[0]}.${dateParts[1]}`;
            return questionDayMonth === dayMonth;
        }
        return false;
    });
}

/**
 * Sort questions by date descending (newest first)
 * @param {Array} questions - Questions to sort
 * @returns {Array} Sorted questions
 */
function sortQuestionsDescending(questions) {
    return questions.sort((a, b) => {
        // Parse dates (DD.MM.YYYY)
        const parseDate = (dateStr) => {
            const parts = dateStr.split('.');
            if (parts.length === 3) {
                // Create date as YYYY-MM-DD for proper comparison
                return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
            return new Date(0); // Fallback for invalid dates
        };

        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);

        // Descending order (newest first)
        return dateB - dateA;
    });
}

/**
 * Fetch and parse questions from GitHub
 */
async function fetchQuestions() {
    try {
        const response = await fetch(GITHUB_URL);

        if (!response.ok) {
            throw new Error('GitHub nicht erreichbar');
        }

        const text = await response.text();
        return parseMarkdownTable(text);
    } catch (error) {
        console.error('Fehler beim Laden der Fragen:', error);
        throw error;
    }
}

/**
 * Display questions in history table
 * @param {Array} questions - Questions to display
 */
function displayHistoryTable(questions) {
    // Clear table
    tableBody.innerHTML = '';

    if (questions.length === 0) {
        // Show empty message
        loadingMessage.style.display = 'none';
        errorMessage.textContent = 'Für dieses Datum sind keine Aufwachfragen vorhanden.';
        errorMessage.style.display = 'block';
        tableContainer.style.display = 'none';
        return;
    }

    // Populate table
    questions.forEach(q => {
        const row = document.createElement('tr');

        const dateCell = document.createElement('td');
        dateCell.textContent = q.date;

        const questionCell = document.createElement('td');
        questionCell.textContent = q.question;
        questionCell.setAttribute('translate', 'no');

        row.appendChild(dateCell);
        row.appendChild(questionCell);
        tableBody.appendChild(row);
    });

    // Show table, hide loading
    loadingMessage.style.display = 'none';
    tableContainer.style.display = 'block';
}

/**
 * Show error message
 * @param {String} message - Error message to display
 */
function showError(message) {
    loadingMessage.style.display = 'none';
    tableContainer.style.display = 'none';
    errorMessage.textContent = message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
    errorMessage.style.display = 'block';
}

/**
 * Main function to load History-Lane
 * @param {String} dayMonth - Optional day/month in DD.MM format. If not provided, uses current date.
 */
async function loadHistoryLane(dayMonth = null) {
    try {
        // Show loading, hide error and table
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        tableContainer.style.display = 'none';

        // Update current displayed day/month
        currentDisplayedDayMonth = dayMonth || getCurrentDayMonth();

        // Update date picker to reflect current displayed day/month
        updateDatePicker();

        // Fetch all questions
        const allQuestions = await fetchQuestions();

        // Filter by target day/month
        const filteredQuestions = filterQuestionsByDayMonth(allQuestions, currentDisplayedDayMonth);

        // Sort descending
        const sortedQuestions = sortQuestionsDescending(filteredQuestions);

        // Display in table
        displayHistoryTable(sortedQuestions);

    } catch (error) {
        showError('Fragen konnten nicht geladen werden. Bitte prüfen Sie Ihre Internetverbindung.');
    }
}

// Event Listeners

// Load questions for selected date from dropdowns
loadDateButton.addEventListener('click', () => {
    const day = daySelect.value;
    const month = monthSelect.value;

    // Validate that both day and month are selected
    if (!day || !month) {
        alert('Bitte wählen Sie einen Tag und einen Monat aus.');
        return;
    }

    // Create DD.MM format and load
    const selectedDayMonth = `${day}.${month}`;
    loadHistoryLane(selectedDayMonth);
});

// Update day options when month changes
monthSelect.addEventListener('change', updateDayOptions);

// Reset to current date (today)
resetButton.addEventListener('click', () => {
    loadHistoryLane(getCurrentDayMonth());
});

// Navigate to previous day
previousDay.addEventListener('click', (e) => {
    e.preventDefault();
    const newDayMonth = decrementDay(currentDisplayedDayMonth);
    loadHistoryLane(newDayMonth);
});

// Navigate to next day
nextDay.addEventListener('click', (e) => {
    e.preventDefault();
    const newDayMonth = incrementDay(currentDisplayedDayMonth);
    loadHistoryLane(newDayMonth);
});

// Display version number
if (versionElement) {
    versionElement.textContent = VERSION;
}

// Initialize day select dropdown on page load
updateDayOptions();

// Load History-Lane on page load (with current date)
loadHistoryLane();
