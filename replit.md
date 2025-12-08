# Based Puzzles

## Overview

Based Puzzles is a web-based puzzle game application featuring Sudoku and Base-themed Crossword puzzles. The application allows users to play puzzles at different difficulty levels, track their performance statistics, compete on leaderboards, and build daily streaks. Built with React, TypeScript, and Tailwind CSS, the app provides a clean, minimal interface with Base blockchain branding integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Language**
- React with TypeScript in strict mode, using functional components and hooks exclusively
- Client-side rendering with Vite as the build tool and development server
- Wouter for lightweight client-side routing

**Component Structure**
- Modular component organization separating concerns:
  - `components/modes/` - Game mode implementations (SudokuMode, CrosswordMode)
  - `components/sudoku/` and `components/crossword/` - Mode-specific UI components
  - `components/ui/` - Shadcn UI component library for consistent design system
  - Shared components for Header, ModeSwitcher, Leaderboard, ProfileStats, Timer
- Custom hooks pattern for game logic separation:
  - `useSudokuGame` - Sudoku game state and logic
  - `useCrosswordGame` - Crossword game state and logic
  - `usePlayerStats` - Player statistics tracking
  - `useLeaderboard` - Leaderboard data management

**State Management**
- Local component state with React hooks (useState, useEffect, useCallback, useRef)
- TanStack Query (React Query) for server state management (configured but not actively used)
- No global state library; state lifted to parent components as needed

**Styling Approach**
- Tailwind CSS with custom theme extending Base blockchain colors
- CSS custom properties for theming (light/dark mode support)
- Design system based on Shadcn UI (New York style variant)
- Utility-first approach with component-specific styles
- Design guidelines emphasizing clean, minimal aesthetics with Base blue (#0052FF) as primary accent

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript
- HTTP server created with Node's `http` module
- Development mode uses Vite middleware for HMR
- Production serves static build output

**API Design**
- RESTful API pattern (routes not yet implemented)
- Routes prefixed with `/api`
- Placeholder route registration in `server/routes.ts`

**Storage Layer**
- In-memory storage implementation (`MemStorage` class)
- Interface-based design (`IStorage`) allowing future database integration
- Current implementation stores user data in Map structures
- Prepared for migration to persistent database (Drizzle ORM configured)

**Session Management**
- Infrastructure prepared for session handling (connect-pg-simple dependency)
- Not yet implemented in current codebase

### Data Storage Solutions

**Current Storage**
- Browser localStorage for all client-side persistence:
  - Game mode preference
  - Player statistics
  - Leaderboard entries
  - Theme preference
- In-memory server storage for user data

**Prepared Database Setup**
- PostgreSQL configured via Drizzle ORM
- Schema defined in `shared/schema.ts`:
  - Users table with id, username, password fields
  - UUID generation for user IDs
- Drizzle Kit configured for migrations
- Database URL expected via environment variable

**Data Models**
- TypeScript interfaces and types defined in `client/src/lib/types.ts`:
  - Game types: PuzzleMode, Difficulty, GameStatus
  - Sudoku: SudokuBoard, SudokuCell
  - Crossword: CrosswordPuzzle, CrosswordCell, CrosswordClue
  - Stats: PlayerStats, ModeStats, LeaderboardEntry
- Zod schemas for validation (drizzle-zod integration)

### Design System & UI Patterns

**Component Library**
- Shadcn UI components with Radix UI primitives
- Comprehensive set of accessible components (Dialog, Button, Card, Toast, etc.)
- Custom component styling with Tailwind variants
- Theme provider for dark/light mode switching

**Typography & Layout**
- Font stack: Inter (UI), JetBrains Mono (puzzles/timers)
- Responsive grid layouts for desktop (two-column) and mobile (stacked)
- Consistent spacing using Tailwind units (2, 4, 6, 8)
- Max-width containers for content areas

**Interaction Patterns**
- Keyboard navigation for puzzle grids
- Modal dialogs for completion/profile
- Toast notifications for feedback
- Hover and active states with elevation effects

### Build & Development

**Development Setup**
- Vite dev server with HMR
- TypeScript compilation (noEmit mode, bundler module resolution)
- Path aliases for clean imports (@/, @shared/, @assets/)
- Replit-specific plugins for development experience

**Production Build**
- esbuild for server bundling
- Vite for client bundling
- Server dependencies selectively bundled for cold start optimization
- Output: `dist/public/` for client, `dist/index.cjs` for server

**Code Organization**
- Monorepo structure with shared types
- Client code in `client/src/`
- Server code in `server/`
- Shared schemas and types in `shared/`
- Path resolution configured in tsconfig and vite config

## External Dependencies

### UI & Component Libraries
- **Radix UI** - Headless UI primitives for accessible components (dialogs, dropdowns, tabs, etc.)
- **Shadcn UI** - Pre-built component system using Radix primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### State & Data Management
- **TanStack Query** - Server state management and caching
- **Wouter** - Lightweight routing library
- **React Hook Form** - Form state management (with Hookform Resolvers)

### Validation & Schemas
- **Zod** - TypeScript-first schema validation
- **Drizzle Zod** - Zod schema generation from Drizzle ORM models

### Database & ORM
- **Drizzle ORM** - TypeScript ORM for PostgreSQL
- **pg** - PostgreSQL client for Node.js
- **connect-pg-simple** - PostgreSQL session store for Express

### Build Tools & Development
- **Vite** - Frontend build tool and dev server
- **esbuild** - Fast JavaScript bundler for server
- **TypeScript** - Type-safe JavaScript
- **PostCSS & Autoprefixer** - CSS processing

### Utilities
- **date-fns** - Date manipulation library
- **clsx & tailwind-merge** - Utility for conditional CSS classes
- **nanoid** - Unique ID generation

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal** - Development error overlay
- **@replit/vite-plugin-cartographer** - Code navigation (dev only)
- **@replit/vite-plugin-dev-banner** - Development banner (dev only)

### Future Integration (Prepared)
- PostgreSQL database (Drizzle schema defined)
- Express session management
- User authentication (passport infrastructure present)