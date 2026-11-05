# AuraTask &bull; Premium Smart To-Do Web Application

A fully functional, modern, and professional **To-Do List Web Application** built with pure **HTML5, CSS3, and Vanilla JavaScript**.

Designed with a **dark glassmorphism design system**, animated ambient backdrops, live analytics, task priority management, category filters, and seamless browser LocalStorage persistence.

---

## 🌟 Key Highlights & Feature Matrix

### 1. 🎨 Premium Dark Glassmorphism UI/UX
- **Obsidian Dark & Frosted Light Themes**: Instant theme toggle with system memory persistence.
- **Ambient Animated Background**: 4 floating organic gradient orbs with hardware-accelerated CSS keyframe animations and a subtle grid overlay.
- **Glassmorphic Components**: Dynamic `backdrop-filter: blur(20px)`, translucent surfaces, border bevels, and inner specular highlights.
- **Interactive Glass Buttons**: Gradient hover states, neon back-glow, click compression effects, and accessible focus outlines.
- **Confetti Celebration**: Pure HTML5 Canvas Confetti explosion engine on task completion.

### 2. 📊 Real-Time Productivity Dashboard
- **Total Tasks**: Total count across all categories.
- **Completed Tasks**: Live count with completion ratio badge.
- **Pending Tasks**: In-progress items counter.
- **Overdue Tasks**: Dynamic calculation of overdue deadlines with alert styling.
- **Radial SVG Progress Gauge**: Animated circular gauge with SVG dashoffset transitions and motivational status indicators.
- **Live System Clock**: Real-time pulsing digital clock with date formatting.

### 3. ⚡ Complete Task Management (CRUD)
- **Add Tasks**: Form modal with validation, title character counter (80 max), multiline description (300 max), priority levels, category selector, and datetime picker.
- **Quick Due Presets**: One-click deadline shortcuts for **Today (6 PM)**, **Tomorrow (6 PM)**, and **Next Week (9 AM)**.
- **Priority Levels**: Color-coded badges with glow highlights for **High (Ruby)**, **Medium (Amber)**, and **Low (Emerald)**.
- **Categories**: Organize tasks by **💼 Work**, **🏠 Personal**, **📚 Study**, **💰 Finance**, **🏋️ Health**, and **✨ Other**.
- **Pin to Top**: Keep important tasks pinned to the top of your list.
- **Duplicate Tasks**: 1-click duplication of any existing task.
- **Edit Tasks**: Instant modal pre-population and real-time updates.
- **Delete Tasks**: Safe deletion backed by a custom glassmorphism confirmation dialog.

### 4. 🔍 Search, Multi-Filter & Sorting
- **Instant Search**: Real-time filtering by title, description, or category with a quick-clear button.
- **Status Tabs**: Filter by **All**, **Active**, **Completed**, and **Overdue** with badge counters.
- **Priority Filter**: Filter tasks by High, Medium, or Low priority.
- **Category Filter**: Filter tasks by specific categories.
- **Multi-Sort Options**:
  - Newest First
  - Oldest First
  - Due Date (Earliest)
  - Due Date (Latest)
  - Priority (High to Low)
  - Alphabetical (A - Z)
- **Active Filter Chips**: Visual tags showing all applied filters with one-click individual or global reset.
- **View Modes**: Instant toggle between **Grid View** and compact **List View**.

### 5. 💾 LocalStorage & Data Protection
- **Automatic Persistence**: Every create, edit, pin, check, and delete operation is instantly persisted.
- **Safe Recovery**: Safe JSON parsing with fallback to initial sample tasks on first launch.
- **Zero Dependencies**: 100% self-contained Vanilla JS, HTML5, and CSS3 with no external NPM or CDN dependencies needed.

### 6. ⌨️ Keyboard Shortcuts
| Hotkey | Action |
|:---:|:---|
| <kbd>N</kbd> | Open New Task modal |
| <kbd>/</kbd> | Focus Search bar |
| <kbd>T</kbd> | Toggle Dark / Light theme |
| <kbd>?</kbd> | Open Keyboard Shortcuts cheatsheet |
| <kbd>Esc</kbd> | Close any open modal or dropdown |

---

## 📁 File Structure

```
To-Do List/
├── index.html        # Semantic HTML5 layout, modals, SVG icons, and containers
├── styles.css        # CSS3 variables, glassmorphism design system, responsive styles
├── app.js            # Modular Vanilla JavaScript (Storage, Audio, Confetti, Dashboard, CRUD)
└── README.md         # Comprehensive documentation
```

---

## 🚀 How to Run the Application

Since AuraTask is built with standard web technologies, there are no build steps, bundlers, or packages to install!

### Option A: Double-Click
Simply double-click `index.html` to open it in your browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari, or Brave).

### Option B: Local Web Server
You can also launch a lightweight local server:
```bash
# Using Python 3:
python -m http.server 8080

# Or using Node.js npx:
npx serve .
```
Then navigate to `http://localhost:8080` in your web browser.

---

## 💻 Browser Compatibility
- Modern Chromium browsers (Google Chrome, Microsoft Edge, Brave, Opera)
- Mozilla Firefox
- Apple Safari (macOS & iOS)
- Responsive design tailored for mobile phones, tablets, laptops, and ultra-wide desktop monitors.
