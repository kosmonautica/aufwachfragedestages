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
const datePicker = document.getElementById('datePicker');
const datePickerNative = document.getElementById('datePickerNative');
const calendarIcon = document.getElementById('calendarIcon');
const loadDateButton = document.getElementById('loadDateButton');
const resetButton = document.getElementById('resetButton');
const previousDay = document.getElementById('previousDay');
const nextDay = document.getElementById('nextDay');

// Track currently displayed date (as Date object)
let currentDisplayedDate = new Date();

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
 * Convert Date object to DD.MM format
 * @param {Date} date - Date object
 * @returns {String} DD.MM format
 */
function dateToDD_MM(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}.${month}`;
}

/**
 * Convert Date object to DD.MM.YYYY format (for date input field)
 * @param {Date} date - Date object
 * @returns {String} DD.MM.YYYY format
 */
function dateToDD_MM_YYYY(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}.${month}.${year}`;
}

/**
 * Update date picker to show the current displayed date
 */
function updateDatePicker() {
    datePicker.value = dateToDD_MM_YYYY(currentDisplayedDate);
    // Also update native date picker
    const year = currentDisplayedDate.getFullYear();
    const month = String(currentDisplayedDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDisplayedDate.getDate()).padStart(2, '0');
    datePickerNative.value = `${year}-${month}-${day}`;
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
 * @param {Date} targetDate - Optional Date object. If not provided, uses current date.
 */
async function loadHistoryLane(targetDate = null) {
    try {
        // Show loading, hide error and table
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        tableContainer.style.display = 'none';

        // Update current displayed date
        if (targetDate) {
            currentDisplayedDate = new Date(targetDate);
        } else {
            currentDisplayedDate = new Date();
        }

        // Update date picker to reflect current displayed date
        updateDatePicker();

        // Get day/month to filter by
        const targetDayMonth = dateToDD_MM(currentDisplayedDate);

        // Fetch all questions
        const allQuestions = await fetchQuestions();

        // Filter by target day/month
        const filteredQuestions = filterQuestionsByDayMonth(allQuestions, targetDayMonth);

        // Sort descending
        const sortedQuestions = sortQuestionsDescending(filteredQuestions);

        // Display in table
        displayHistoryTable(sortedQuestions);

    } catch (error) {
        showError('Fragen konnten nicht geladen werden. Bitte prüfen Sie Ihre Internetverbindung.');
    }
}

// Event Listeners

// Calendar icon click - open native date picker
calendarIcon.addEventListener('click', () => {
    datePickerNative.showPicker();
});

// Native date picker change - update text field
datePickerNative.addEventListener('change', () => {
    if (datePickerNative.value) {
        const [year, month, day] = datePickerNative.value.split('-');
        datePicker.value = `${day}.${month}.${year}`;
        // Auto-load questions for selected date
        const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        loadHistoryLane(selectedDate);
    }
});

// Load questions for selected date
loadDateButton.addEventListener('click', () => {
    if (datePicker.value) {
        // datePicker.value is in DD.MM.YYYY format
        const [day, month, year] = datePicker.value.split('.');

        // Validate format
        if (day && month && year && day.length === 2 && month.length === 2 && year.length === 4) {
            const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

            // Validate that the date is valid (handles invalid dates like 31.02.2024)
            if (selectedDate.getDate() === parseInt(day) &&
                selectedDate.getMonth() === parseInt(month) - 1 &&
                selectedDate.getFullYear() === parseInt(year)) {
                loadHistoryLane(selectedDate);
            } else {
                alert('Ungültiges Datum. Bitte verwenden Sie das Format dd.mm.yyyy');
            }
        } else {
            alert('Bitte verwenden Sie das Format dd.mm.yyyy');
        }
    }
});

// Reset to current date (today)
resetButton.addEventListener('click', () => {
    loadHistoryLane(new Date());
});

// Navigate to previous day
previousDay.addEventListener('click', (e) => {
    e.preventDefault();
    const newDate = new Date(currentDisplayedDate);
    newDate.setDate(newDate.getDate() - 1);
    loadHistoryLane(newDate);
});

// Navigate to next day
nextDay.addEventListener('click', (e) => {
    e.preventDefault();
    const newDate = new Date(currentDisplayedDate);
    newDate.setDate(newDate.getDate() + 1);
    loadHistoryLane(newDate);
});

// Display version number
if (versionElement) {
    versionElement.textContent = VERSION;
}

// Load History-Lane on page load (with current date)
loadHistoryLane();
