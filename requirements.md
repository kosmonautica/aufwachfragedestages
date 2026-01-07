# Wake-Up Question Website

## 1. Goal and Context
- **Brief description:** A minimalistic website that displays a random wake-up question from the GitHub repository on each visit.
- **Target audience:** Publicly accessible for all visitors of aufwachfrage.de
- **Environment:** Static website on classic web hosting (FTP upload), no backend infrastructure needed.

## 2. Features / Use Cases

### 2.1 Display Random Wake-Up Question
- **Description:** When loading the page, a random question is fetched from the GitHub repo and displayed.
- **Actors:** Website visitors
- **Inputs:** None (automatic retrieval)
- **Outputs:**
  - Wake-up question (large font)
  - Date of the question (small font)
- **Data source:** https://raw.githubusercontent.com/kosmonautica/Aufwachfrage/main/README.md
- **Data format:** Markdown table in README.md with columns: Date | Wake-Up Question | Thread on X/LinkedIn
- **Important:** Questions must be displayed in their exact original wording without any translation or modification
- **Error cases:**
  - GitHub not reachable: Display fallback message
  - Parsing error: Display user-friendly error message

### 2.2 Load New Question
- **Description:** Clicking a button loads a new random question (without page reload).
- **Actors:** Website visitors
- **Inputs:** Button click
- **Outputs:** New wake-up question with date
- **Rule:** No repetition of the same question immediately in succession.
- **Randomness:** Each button click must select a truly random question from the entire question catalog, ensuring diverse questions are shown.

### 2.3 History-Lane
- **Description:** A separate page that displays all wake-up questions that were published on the current day (day + month) across all years.
- **Actors:** Website visitors
- **Access:** Link at the bottom of the index page with text "Welche Aufwachfragen gab es am heutigen Datum in den letzten Jahren?"
- **Inputs:** Current date (automatic, client-side)
- **Outputs:**
  - Page heading: "Aufwachfragen des heutigen Tages aus den letzten Jahren"
  - Table with columns: Date | Wake-Up Question
  - Questions filtered by current day/month (e.g., all questions from January 7th across all years)
  - Sorted in descending order (newest first)
- **Data source:** Same GitHub Raw API as main page
- **Navigation:** Link back to index page
- **Version display:** Version number in bottom right corner (same as index page)
- **Important:** Questions must be displayed in their exact original wording without any translation or modification

## 3. Technical Requirements

### Languages
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

### Frameworks / Libraries
- None. Purely static without external dependencies.

### Architecture
- Main page files:
  - `index.html` (main page structure)
  - `style.css` (shared design for all pages)
  - `script.js` (main page logic)
- History-Lane page files:
  - `historylane.html` (history-lane page structure)
  - `historylane.js` (history-lane page logic)
- Testing:
  - `test.html` (unit tests for all functionality)
- Shared styling via `style.css` for consistent design

### Interfaces
- GitHub Raw Content API: `https://raw.githubusercontent.com/kosmonautica/Aufwachfrage/main/README.md`
- Parsing: Split Markdown table line by line, pipe character as column separator

### Deployment
- FTP upload to web hosting
- No build steps required

### Versioning
- Version number must be displayed on the website (bottom right, small font)
- Version follows semantic versioning (e.g., v1.0.0, v1.1.0, v2.0.0)
- Version number is stored in both `script.js` and `historylane.js` as a constant
- Version must be manually incremented with each commit that changes functionality or fixes bugs
- **Both files must have the same version number**
- Version increment guidelines:
  - **Patch** (v1.0.X): Bug fixes, minor text changes
  - **Minor** (v1.X.0): New features, design changes
  - **Major** (vX.0.0): Breaking changes, major redesigns

## 4. Non-Functional Requirements

### Performance
- Fast initial page load (HTML/CSS immediately visible)
- Question is loaded asynchronously

### Security
- No sensitive data
- No user input

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)

### Responsive Design
- Mobile-optimized
- Flexible layout for different screen sizes

## 5. Design Specification

### Color Scheme
- Background: Dark (e.g., #1a1a1a or #121212)
- Font: White (#ffffff)
- Date/Attribution: Light gray (#aaaaaa)

### Layout - Main Page (vertically centered)
1. **Page heading** (top, centered): "Aufwachfrage des Tages aus dem Archiv von www.aufwachfrage.de."
2. **Wake-up question** (centered, large font)
3. **Date** (below question, small font, gray)
4. **Attribution:** "Author: Udo Wiegärtner | Source: www.aufwachfrage.de"
5. **Button:** "Nächste Frage aus dem Archiv der Aufwachfrage."
6. **History-Lane link** (bottom): "Welche Aufwachfragen gab es am heutigen Datum in den letzten Jahren?"
7. **Version number** (bottom right corner, very small font, e.g., "v1.0.0")

### Layout - History-Lane Page
1. **Page heading** (top, centered): "Aufwachfragen des heutigen Tages aus den letzten Jahren"
2. **Table** (centered):
   - Column 1: Date (DD.MM.YYYY format)
   - Column 2: Wake-Up Question
   - Rows sorted by date descending (newest first)
   - Minimalistic table styling (no heavy borders, clean look)
3. **Back link** (top or bottom): Link to return to index page
4. **Version number** (bottom right corner, very small font)

### Links
- All occurrences of "www.aufwachfrage.de" must be clickable links
- External links should open https://www.aufwachfrage.de in a new tab
- Links must be clearly recognizable as links (underlined)
- History-Lane link on main page should navigate to `historylane.html`
- Back link on History-Lane page should navigate to `index.html`

### Typography
- Minimalistic, easily readable
- Sans-serif font

## 6. Quality Rules

### Code Style
- Clean, readable HTML/CSS/JS
- Comments for important logic sections (e.g., parsing the Markdown table)

### Tests
- **Unit Tests**: `test.html` with comprehensive automated tests
  - Markdown parsing tests
  - Date filtering and sorting tests (History-Lane)
  - Exact wording preservation tests
  - Edge case handling (leap years, empty results)
  - All tests must pass before deployment
- **Manual Browser Tests**:
  - Main page: GitHub fetch works, random selection, no immediate repetition
  - History-Lane: Correct date filtering, descending sort, navigation
  - Responsive design on mobile viewport
  - Error handling (network failures)

### Documentation
- README.md with deployment instructions (FTP upload)

## 7. Open Questions

*All clarified.*
