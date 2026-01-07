# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Minimalistic static website that displays random wake-up questions from a GitHub repository. Target environment: classic web hosting (FTP upload), no backend infrastructure.

**All functional requirements are documented in `requirements.md`** – this file only describes how to work in this repository.

## Tech Stack

- **Main page:** `index.html`, `style.css`, `script.js`
- **History-Lane page:** `historylane.html`, `historylane.js` (shares `style.css`)
- **Testing:** `test.html` (unit tests)
- **Languages:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **No frameworks, libraries, or build tools**
- **Data source:** GitHub Raw API (parse Markdown table)

## Workflow

### Development and Testing
```bash
# Local testing (browser or simple server)
python3 -m http.server
# Then open http://localhost:8000
```

Manual browser testing required (see test cases in `requirements.md`, section 6).

### Testing Before Commit
**CRITICAL: Run all tests before committing code changes**

**When to test:**
- ✅ **Required** when changing: `index.html`, `style.css`, `script.js`, `historylane.html`, `historylane.js`, or `test.html`
- ❌ **Not required** when only changing: `requirements.md`, `CLAUDE.md`, `README.md`, `IMPLEMENTATION_PLAN.md`, or other documentation files

**Test checklist for code changes:**
1. **Unit Tests**: Open `http://localhost:8000/test.html` and verify all tests pass (35/35)
   - 12 tests for main page functionality
   - 23 tests for History-Lane functionality
2. **Manual Browser Tests - Main Page**: Open `http://localhost:8000/` and verify:
   - Questions load correctly from GitHub
   - Random selection works (click button multiple times)
   - No same question appears twice in a row
   - Questions display in exact original wording (no translation)
   - Version number displays v1.2.0 in bottom right corner
   - Page heading and all text elements are visible
   - History-Lane link is visible and clickable
   - Responsive design works (test on mobile viewport)
   - Error handling works (temporarily break GitHub URL to test)
3. **Manual Browser Tests - History-Lane**: Open `http://localhost:8000/historylane.html` and verify:
   - Default behavior: Questions for current day/month are displayed on load
   - Date picker field shows current date in DD.MM format on load (no year)
   - Date picker input accepts manual input in DD.MM format (e.g., 07.01)
   - Enter a custom date in DD.MM format and click "Aktualisieren"
   - Questions for selected date are displayed correctly
   - "Heute" button is always visible
   - Click "Heute" and verify it resets to current date
   - Date picker field updates to show current date after clicking "Heute"
   - Click "Früher" (previous day) multiple times and verify:
     - Questions update automatically after each click
     - Date picker field updates to show new date
     - Navigation works across month boundaries (e.g., from Feb 1 to Jan 31)
   - Click "Später" (next day) multiple times and verify:
     - Questions update automatically after each click
     - Date picker field updates to show new date
     - Navigation works across month boundaries (e.g., from Jan 31 to Feb 1)
   - Empty state message "Für dieses Datum sind keine Aufwachfragen vorhanden." displays when no questions found (test with a date like 15.06)
   - Questions are sorted descending (newest first) for all dates
   - Table is readable and well-styled (dark theme)
   - Date controls are properly styled and centered
   - Navigation links "Früher" and "Später" are visible and properly styled
   - Back link returns to index page
   - Version number displays v1.3.0
   - Exact wording preserved (no translation)
   - Responsive design works on mobile (including date picker and navigation links)
4. **Visual Inspection**: Check that all styling looks correct, text is readable, layout is centered on both pages

**Never commit code changes without completing all tests above.**
Commit messages must not contain any hints about coding help by Claude Code or other LLMs.

### Deployment
- FTP upload of all files to web hosting:
  - `index.html`, `historylane.html`
  - `style.css`
  - `script.js`, `historylane.js`
  - `test.html` (optional, for testing)
- No build steps required

### Code Style
- Clean, readable HTML/CSS/JS
- Comments for important logic sections (e.g., Markdown table parsing)
- German variable/function names are acceptable

## Requirements

**See `requirements.md` for:**
- Functions and use cases (Section 2)
- Design specifications: colors, layout, typography (Section 5)
- Non-functional requirements: performance, browser compatibility (Section 4)
- Quality rules and test cases (Section 6)

## Maintenance / Consistency

**When requirements or scope changes:**
1. First update `requirements.md` (functional requirements)
2. Then check if `CLAUDE.md` needs updating (e.g., tech stack, workflows, development commands)

**When `CLAUDE.md` changes:**
- Check if requirements in `requirements.md` are affected
- If unclear: `requirements.md` is the authoritative source for "What should the software do?"

**Separation:**
- `requirements.md` = **What** should the software do? (Functions, design, requirements)
- `CLAUDE.md` = **How** to work in this repository? (Tech stack, workflows, commands)
