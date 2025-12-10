# Backend Integration Guide for Based Puzzles

This document outlines the API endpoints and data structures required for integrating a backend with the Based Puzzles frontend. The backend should handle data persistence, leaderboards, user stats, and onchain features like Smart Wallet authentication and NFT rewards.

## Authentication
- **Method**: Wallet-based (Base Smart Wallet)
- **Header**: `Authorization: Bearer <wallet-signature>`
- **Note**: All endpoints require wallet authentication for user-specific data.

## API Endpoints

### 1. Leaderboard
**Endpoint**: `GET /api/leaderboard?gameMode={sudoku|crossword}&limit=10&offset=0`

**Purpose**: Retrieve top players for leaderboards.

**Query Params**:
- `gameMode`: "sudoku" or "crossword"
- `limit`: Number of results (default 10)
- `offset`: Pagination offset (default 0)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "walletAddress": "0x123...abc",
      "username": "PuzzleMaster",
      "bestTime": 150, // seconds
      "score": 1500,
      "gameMode": "sudoku",
      "difficulty": "hard",
      "completedAt": "2025-12-08T10:00:00Z"
    }
  ],
  "total": 100
}
```

### 2. User Stats
**Endpoint**: `GET /api/user/stats`

**Purpose**: Get current user's statistics.

**Response**:
```json
{
  "success": true,
  "data": {
    "walletAddress": "0x123...abc",
    "totalGames": 50,
    "gamesWon": 45,
    "bestSudokuTime": 120,
    "bestCrosswordTime": 180,
    "currentStreak": 7,
    "longestStreak": 12,
    "averageScore": 1350,
    "totalPlayTime": 7200, // seconds
    "lastPlayed": "2025-12-08T10:00:00Z",
    "achievements": ["FirstWin", "StreakMaster"]
  }
}
```

### 3. Submit Game Result
**Endpoint**: `POST /api/games/submit`

**Purpose**: Submit completed game for leaderboard and stats update.

**Request Body**:
```json
{
  "gameMode": "sudoku",
  "difficulty": "medium",
  "timeTaken": 180, // seconds
  "score": 1400,
  "completed": true,
  "hintsUsed": 2
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "newRank": 15,
    "newStreak": 8,
    "nftEarned": "SudokuChampion" // if applicable
  }
}
```

### 4. Daily Puzzle
**Endpoint**: `GET /api/puzzles/daily?gameMode={sudoku|crossword}&date=2025-12-08`

**Purpose**: Get the daily challenge puzzle.

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "daily-sudoku-2025-12-08",
    "gameMode": "sudoku",
    "difficulty": "medium",
    "grid": [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      // ... 9x9 grid
    ],
    "date": "2025-12-08",
    "expiresAt": "2025-12-09T00:00:00Z"
  }
}
```

### 5. User Profile
**Endpoint**: `GET /api/user/profile`

**Purpose**: Get user profile information.

**Response**:
```json
{
  "success": true,
  "data": {
    "walletAddress": "0x123...abc",
    "username": "BasePlayer",
    "avatar": "ipfs://Qm...",
    "joinedAt": "2025-01-01T00:00:00Z",
    "nftBadges": [
      {
        "id": "sudoku-master",
        "name": "Sudoku Master",
        "image": "ipfs://Qm...",
        "earnedAt": "2025-12-01T00:00:00Z"
      }
    ],
    "totalRewards": 5
  }
}
```

### 6. Save Game Session
**Endpoint**: `POST /api/games/session`

**Purpose**: Save incomplete game state for continuation.

**Request Body**:
```json
{
  "gameMode": "crossword",
  "puzzleId": "daily-crossword-2025-12-08",
  "currentGrid": [...], // partial grid state
  "elapsedTime": 300,
  "hintsUsed": 1
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "sessionId": "sess-456",
    "expiresAt": "2025-12-15T00:00:00Z"
  }
}
```

### 7. Load Game Session
**Endpoint**: `GET /api/games/session/{sessionId}`

**Purpose**: Resume a saved game.

**Response**: Same as save request body.

### 8. NFT Minting
**Endpoint**: `POST /api/nfts/mint`

**Purpose**: Mint NFT reward for achievement.

**Request Body**:
```json
{
  "achievement": "StreakMaster",
  "metadata": {
    "name": "Streak Master Badge",
    "description": "Awarded for maintaining a 10-game streak"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "txHash": "0x...",
    "tokenId": 123,
    "nftContract": "0x..."
  }
}
```

## Database Schema Suggestions

### Users Table
- wallet_address (primary key)
- username
- avatar_url
- joined_at
- total_games
- total_wins

### Games Table
- id
- wallet_address (foreign key)
- game_mode
- difficulty
- time_taken
- score
- completed
- hints_used
- played_at

### Leaderboards Table (Materialized View)
- Computed from games table with rankings

### Sessions Table
- id
- wallet_address
- game_mode
- puzzle_id
- grid_state (JSON)
- elapsed_time
- expires_at

### NFTs Table
- token_id
- wallet_address
- achievement_type
- minted_at
- metadata (JSON)

## Implementation Notes
- Use PostgreSQL with Drizzle ORM (as in original setup)
- Implement rate limiting for API calls
- Add input validation with Zod
- Store NFT metadata on IPFS
- Use Web3 libraries for wallet verification
- Implement caching for leaderboards

This backend integration will enable full functionality: persistent stats, global leaderboards, daily challenges, and onchain rewards.</content>
<parameter name="filePath">g:\2025\Learning\Blockchain\Base\Demo\BasedPuzzles-Frontend\backend-integration.md