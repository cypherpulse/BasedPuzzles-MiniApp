# Based Puzzles - Design Guidelines

## Design Approach

**System Selection**: Clean minimal design system with Base blockchain branding integration
- Focus on legibility, clarity, and distraction-free puzzle solving
- Prioritize functional hierarchy over decorative elements
- Base blue (#0052FF) as primary accent throughout

## Typography

**Font Families**:
- Primary: Inter (via Google Fonts CDN) - for UI, stats, leaderboards
- Monospace: JetBrains Mono - for puzzle grids and timers

**Hierarchy**:
- App Title: text-3xl font-bold
- Section Headers: text-2xl font-semibold
- Mode Tabs: text-lg font-medium
- Puzzle Numbers: text-base font-mono
- Clues/Stats: text-sm
- Timer: text-2xl font-mono tabular-nums
- Leaderboard entries: text-sm

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8
- Component padding: p-4 to p-8
- Grid gaps: gap-2 for tight grids, gap-4 for cards
- Section margins: mb-6 to mb-8
- Button padding: px-6 py-3

**Container Strategy**:
- Max width: max-w-7xl for main container
- Puzzle grids: centered with max-w-2xl
- Sidebar content: w-80 on desktop, full-width mobile

**Grid Layout**:
- Desktop: Two-column (puzzle area + sidebar with leaderboard/stats)
- Mobile: Single column, stacked vertically

## Component Library

### Navigation & Mode Switching
**Header**:
- Fixed top bar with app title and user summary
- White background with subtle border-b
- Height: h-16
- Padding: px-6

**Mode Switcher**:
- Two large pill-style buttons side-by-side
- Active: bg-blue-600 text-white
- Inactive: border-2 border-blue-600 text-blue-600 bg-white
- Rounded: rounded-lg
- Padding: px-8 py-4
- Center-aligned below header with gap-4

### Puzzle Grids

**Sudoku Grid**:
- 9×9 grid with clear major/minor lines
- Major gridlines (3×3 boxes): border-2 border-gray-800
- Minor gridlines: border border-gray-300
- Cell size: w-12 h-12 (desktop), w-10 h-10 (mobile)
- Cell text: text-xl font-mono centered
- Selected cell: bg-blue-50 border-2 border-blue-600
- Readonly cells: bg-gray-50 font-semibold
- Error cells: text-red-600 bg-red-50
- Interactive cells: hover:bg-gray-50 cursor-pointer

**Crossword Grid**:
- Variable size grid based on puzzle
- Black blocks: bg-gray-900
- Letter cells: border border-gray-300 bg-white
- Cell size: w-10 h-10
- Clue numbers: text-xs absolute top-0 left-0 text-gray-500
- Active clue highlight: bg-blue-100 border-blue-600
- Selected cell: border-2 border-blue-600
- Incorrect: bg-red-50

### Controls & Actions

**Difficulty Selector**:
- Three buttons: Easy, Medium, Hard
- Rounded pill group with gap-2
- Active: bg-blue-600 text-white
- Inactive: bg-gray-100 text-gray-700 hover:bg-gray-200

**Primary Buttons** (New Game, Check Solution, Save):
- bg-blue-600 text-white rounded-lg px-6 py-3
- hover:bg-blue-700
- Font: font-semibold

**Secondary Buttons** (Reset, Hints):
- border-2 border-gray-300 rounded-lg px-6 py-3
- hover:bg-gray-50

**Timer Display**:
- Large monospace font (text-2xl font-mono)
- Minimal card: bg-gray-50 rounded-lg p-4
- Always visible at top of puzzle area

### Data Display

**Leaderboard Card**:
- White background with border border-gray-200 rounded-lg
- Padding: p-6
- Table with alternating row backgrounds (even:bg-gray-50)
- Header row: font-semibold text-gray-700 border-b-2
- Rank column: text-blue-600 font-bold
- Time column: font-mono

**Stats Cards**:
- Grid of stat items (grid-cols-2 gap-4)
- Each stat: bg-white border rounded-lg p-4
- Large number: text-3xl font-bold text-blue-600
- Label: text-sm text-gray-600 mt-1

**Player Title Badge**:
- Inline badge with bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-medium

### Overlays & Modals

**Completion Modal**:
- Centered overlay with bg-white rounded-xl shadow-2xl
- Max width: max-w-md
- Padding: p-8
- Celebration icon at top (use Heroicons check-circle)
- Stats summary with large time display
- Action buttons stacked with gap-3

**Crossword Clues Panel**:
- Scrollable sidebar or drawer
- Grouped sections: "Across" and "Down"
- Active clue: bg-blue-50 border-l-4 border-blue-600
- Clue items: py-3 px-4 hover:bg-gray-50 cursor-pointer

## Visual Refinements

**Shadows**: Use sparingly
- Cards: shadow-sm
- Modals: shadow-2xl
- No shadows on puzzle grids

**Borders**: Consistent stroke weights
- Major elements: border-2
- Minor elements: border
- Focus states: ring-2 ring-blue-600 ring-offset-2

**Rounded Corners**:
- Buttons/badges: rounded-lg
- Cards: rounded-lg
- Modals: rounded-xl
- Inputs: rounded-md

## Icons
Use **Heroicons** (outline style) via CDN:
- Clock icon for timer
- Check-circle for completion
- Trophy for leaderboard
- User for profile
- Star for achievements
- Light-bulb for hints

## Images
No hero images needed - this is a functional game interface. All visuals are UI-driven through the puzzle grids and data displays.

## Responsive Breakpoints
- Mobile (base): Single column, stacked layout
- Tablet (md:): Begin side-by-side for some elements
- Desktop (lg:): Full two-column layout with sidebar