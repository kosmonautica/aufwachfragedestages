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
- ❌ **Not required** when only changing documentation files

**Test process:**
1. Run unit tests: `http://localhost:8000/test.html` (all tests must pass)
2. Follow manual test checklist in `requirements.md`, Section 6

**Never commit code changes without completing all tests.**

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

### AI Workflow Preferences
- Use thinking mode only when explicitly requested for complex problem-solving
- Keep responses concise and focused on the task at hand
- Minimize response verbosity to save tokens (avoid unnecessary explanations or repetition)

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
