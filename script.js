// Version
const VERSION = 'v1.0.0';

// GitHub data source
const GITHUB_URL = 'https://raw.githubusercontent.com/kosmonautica/Aufwachfrage/main/README.md';

// Store all questions and last displayed question
let allQuestions = [];
let lastQuestion = null;

// DOM elements
const questionElement = document.getElementById('question');
const dateElement = document.getElementById('date');
const newQuestionBtn = document.getElementById('newQuestionBtn');
const versionElement = document.getElementById('version');

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
 * Parse Markdown table from GitHub README
 * Expected format: | Datum | Aufwachfrage | Thread on X/LinkedIn |
 */
function parseMarkdownTable(markdown) {
    const questions = [];
    const lines = markdown.split('\n');

    // Find table rows (skip header and separator)
    let inTable = false;

    for (let line of lines) {
        // Check if line is a table row
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
 * Get a random question that is different from the last one
 */
function getRandomQuestion() {
    if (allQuestions.length === 0) {
        return null;
    }

    // If only one question, return it
    if (allQuestions.length === 1) {
        return allQuestions[0];
    }

    // Get random question different from last one
    let randomQuestion;
    do {
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        randomQuestion = allQuestions[randomIndex];
    } while (lastQuestion && randomQuestion.question === lastQuestion.question);

    return randomQuestion;
}

/**
 * Display a question on the page
 */
function displayQuestion(questionData) {
    if (!questionData) {
        questionElement.textContent = 'Keine Fragen verfügbar';
        dateElement.textContent = '';
        return;
    }

    questionElement.textContent = questionData.question;
    dateElement.textContent = questionData.date;
    lastQuestion = questionData;
}

/**
 * Show error message
 */
function showError(message) {
    questionElement.textContent = message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
    dateElement.textContent = '';
}

/**
 * Load and display a new question
 */
async function loadNewQuestion() {
    try {
        // Show loading state
        questionElement.textContent = 'Laden...';
        dateElement.textContent = '';

        // Fetch questions if not already loaded
        if (allQuestions.length === 0) {
            allQuestions = await fetchQuestions();
        }

        // Get and display random question
        const question = getRandomQuestion();
        displayQuestion(question);

    } catch (error) {
        showError('Fragen konnten nicht geladen werden. Bitte prüfen Sie Ihre Internetverbindung.');
    }
}

// Event listeners
newQuestionBtn.addEventListener('click', loadNewQuestion);

// Display version number
if (versionElement) {
    versionElement.textContent = VERSION;
}

// Load first question on page load
loadNewQuestion();
