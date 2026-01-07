// Version
const VERSION = 'v1.2.0';

// GitHub data source
const GITHUB_URL = 'https://raw.githubusercontent.com/kosmonautica/Aufwachfrage/main/README.md';

// DOM elements
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');
const tableContainer = document.getElementById('tableContainer');
const tableBody = document.getElementById('tableBody');
const versionElement = document.getElementById('version');

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
        errorMessage.textContent = 'Keine Fragen für diesen Tag gefunden.';
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
 */
async function loadHistoryLane() {
    try {
        // Get current day/month
        const currentDayMonth = getCurrentDayMonth();

        // Fetch all questions
        const allQuestions = await fetchQuestions();

        // Filter by current day/month
        const filteredQuestions = filterQuestionsByDayMonth(allQuestions, currentDayMonth);

        // Sort descending
        const sortedQuestions = sortQuestionsDescending(filteredQuestions);

        // Display in table
        displayHistoryTable(sortedQuestions);

    } catch (error) {
        showError('Fragen konnten nicht geladen werden. Bitte prüfen Sie Ihre Internetverbindung.');
    }
}

// Display version number
if (versionElement) {
    versionElement.textContent = VERSION;
}

// Load History-Lane on page load
loadHistoryLane();
