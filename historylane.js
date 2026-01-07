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
 * Update date picker to show the current displayed day/month
 */
function updateDatePicker() {
    datePicker.value = currentDisplayedDayMonth;
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

// Load questions for selected date
loadDateButton.addEventListener('click', () => {
    if (datePicker.value) {
        // datePicker.value is in DD.MM format
        const parts = datePicker.value.split('.');

        // Validate format
        if (parts.length === 2 && parts[0].length === 2 && parts[1].length === 2) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]);

            // Validate ranges
            if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
                // Use current year for validation
                const currentYear = new Date().getFullYear();
                const testDate = new Date(currentYear, month - 1, day);

                // Validate that the date is valid (handles invalid dates like 31.02)
                if (testDate.getDate() === day && testDate.getMonth() === month - 1) {
                    loadHistoryLane(datePicker.value);
                } else {
                    alert('Ungültiges Datum. Bitte verwenden Sie das Format dd.mm');
                }
            } else {
                alert('Ungültiges Datum. Tag muss zwischen 01-31 und Monat zwischen 01-12 sein.');
            }
        } else {
            alert('Bitte verwenden Sie das Format dd.mm');
        }
    }
});

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

// Load History-Lane on page load (with current date)
loadHistoryLane();
