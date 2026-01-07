# Implementation Plan: History-Lane Feature

## Overview
Add a History-Lane feature that displays all wake-up questions from the same day/month across all years.

## Files to Modify

### 1. index.html
**Changes:**
- Add History-Lane link at the bottom (before version number)
- Link text: "Welche Aufwachfragen gab es am heutigen Datum in den letzten Jahren?"
- Link target: `historylane.html`

**Location:** After button, before version div

### 2. style.css
**New styles needed:**
- `.history-link` - Style for History-Lane link on main page
- `.table-container` - Container for History-Lane table
- `table`, `thead`, `tbody`, `tr`, `th`, `td` - Table styling
  - Minimalistic design
  - Dark theme consistent (#1a1a1a background)
  - White text for questions
  - Gray text for dates (#aaaaaa)
  - No heavy borders
  - Responsive design
- `.back-link` - Style for back navigation link

**Design principles:**
- Consistent with existing dark theme
- Clean, minimalistic table
- Readable on mobile devices

### 3. script.js
**Changes:**
- Bump version from v1.1.0 to v1.2.0 (minor version for new feature)

**Reason:** History-Lane is a new feature (minor version increment)

## Files to Create

### 4. historylane.html
**Structure:**
```html
<!DOCTYPE html>
<html lang="de" translate="no">
<head>
    - Meta tags (charset, viewport, description)
    - Meta tag for no translation
    - Title: "History-Lane - Aufwachfrage"
    - Link to style.css
</head>
<body>
    - Back link to index.html (top)
    - Main container:
        - Page heading: "Aufwachfragen des heutigen Tages aus den letzten Jahren"
        - Table container:
            - Table with id="historyTable"
            - thead: Date | Aufwachfrage
            - tbody: (populated by JS)
        - Loading/Error message areas
    - Version number display (bottom right)
    - Script tag for historylane.js
</body>
</html>
```

### 5. historylane.js
**Core Logic:**

#### Constants
```javascript
const VERSION = 'v1.2.0';
const GITHUB_URL = 'https://raw.githubusercontent.com/kosmonautica/Aufwachfrage/main/README.md';
```

#### Functions

**1. getCurrentDayMonth()**
- Get current date
- Extract day and month (DD.MM format)
- Return as string for comparison

**2. parseMarkdownTable(markdown)**
- Reuse parsing logic from script.js
- Split by lines
- Identify table rows
- Extract date and question columns
- Return array of {date, question} objects

**3. filterQuestionsByDayMonth(questions, dayMonth)**
- Input: All questions, target day/month (e.g., "07.01")
- Filter questions where date matches DD.MM pattern
- Return filtered array

**4. sortQuestionsDescending(questions)**
- Sort by date descending (newest first)
- Parse DD.MM.YYYY format for comparison
- Return sorted array

**5. fetchQuestions()**
- Async function
- Fetch from GitHub Raw API
- Parse Markdown table
- Return questions array
- Handle errors (network, parsing)

**6. displayHistoryTable(questions)**
- Get tbody element
- Clear existing content
- For each question:
  - Create table row
  - Add date cell
  - Add question cell
  - Append to tbody
- Handle empty case: "Keine Fragen für diesen Tag gefunden"

**7. showError(message)**
- Display error message
- Replace table with error text

**8. loadHistoryLane()**
- Main orchestration function
- Show loading state
- Get current day/month
- Fetch all questions
- Filter by day/month
- Sort descending
- Display in table
- Handle errors

#### Event Handlers
- Display version number on page load
- Call loadHistoryLane() on page load

## Implementation Steps

### Phase 1: Update Existing Files
1. **index.html**: Add History-Lane link
2. **script.js**: Bump version to v1.2.0
3. Commit: "Add History-Lane link to index page and bump version"

### Phase 2: Create CSS Styles
4. **style.css**: Add all new styles for History-Lane
   - History link styling
   - Table styling
   - Back link styling
   - Responsive design
5. Commit: "Add styles for History-Lane page and table"

### Phase 3: Create History-Lane Page
6. **historylane.html**: Create HTML structure
7. Commit: "Create History-Lane HTML page"

### Phase 4: Implement JavaScript Logic
8. **historylane.js**: Implement all functions
   - Date filtering logic
   - Table rendering
   - Error handling
9. Commit: "Implement History-Lane JavaScript logic"

### Phase 5: Testing
10. **Manual Browser Tests**:
    - Visit index.html
    - Click History-Lane link
    - Verify correct questions for today's date
    - Verify sorting (descending)
    - Verify exact wording (no translation)
    - Test back link
    - Test on mobile viewport
    - Test error handling (break GitHub URL temporarily)
    - Verify version number displays

11. **Unit Tests** (optional):
    - Could add tests to test.html for date filtering logic
    - Test getCurrentDayMonth()
    - Test filterQuestionsByDayMonth()
    - Test sortQuestionsDescending()

### Phase 6: Final Commit
12. Fix any bugs found during testing
13. Ensure version is v1.2.0 on both pages
14. Final commit if needed: "Fix History-Lane bugs"

## Edge Cases to Handle

1. **No questions for current date**: Display message "Keine Fragen für diesen Tag gefunden"
2. **GitHub API unavailable**: Show error message
3. **Parsing errors**: Show error message
4. **Date format variations**: Ensure DD.MM.YYYY parsing is robust
5. **Leap years**: February 29th handling
6. **Mobile viewport**: Table should be scrollable/responsive
7. **Very long questions**: Table cells should wrap text

## Testing Checklist

- [ ] History-Lane link appears on index page
- [ ] Link navigates to historylane.html
- [ ] History-Lane page shows correct heading
- [ ] Table displays questions for current day/month
- [ ] Questions are sorted descending (newest first)
- [ ] Exact wording preserved (German/English)
- [ ] Version number v1.2.0 displays on both pages
- [ ] Back link returns to index page
- [ ] Error handling works (network failure)
- [ ] Responsive design on mobile
- [ ] Table is readable and well-styled
- [ ] No console errors

## Success Criteria

✅ User can navigate from index to History-Lane
✅ History-Lane displays all questions from today's date across years
✅ Questions are sorted newest first
✅ Exact wording preserved (no translation)
✅ Clean, readable table design
✅ Consistent with main page design (dark theme)
✅ Version v1.2.0 displayed on both pages
✅ All tests pass
