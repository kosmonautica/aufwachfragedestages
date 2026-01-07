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

## 3. Technical Requirements

### Languages
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

### Frameworks / Libraries
- None. Purely static without external dependencies.

### Architecture
- Three separate files:
  - `index.html` (structure)
  - `style.css` (design)
  - `script.js` (logic)

### Interfaces
- GitHub Raw Content API: `https://raw.githubusercontent.com/kosmonautica/Aufwachfrage/main/README.md`
- Parsing: Split Markdown table line by line, pipe character as column separator

### Deployment
- FTP upload to web hosting
- No build steps required

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

### Layout (vertically centered)
1. **Wake-up question** (centered, large font)
2. **Date** (below, small font, gray)
3. **Attribution:** "Author: Udo Wiegärtner | Source: www.aufwachfrage.de"
4. **Button:** "New question from aufwachfrage.de"

### Typography
- Minimalistic, easily readable
- Sans-serif font

## 6. Quality Rules

### Code Style
- Clean, readable HTML/CSS/JS
- Comments for important logic sections (e.g., parsing the Markdown table)

### Tests
- Manual test in browser
- Verification: GitHub fetch works, error case is handled, no immediate repetition

### Documentation
- README.md with deployment instructions (FTP upload)

## 7. Open Questions

*All clarified.*
