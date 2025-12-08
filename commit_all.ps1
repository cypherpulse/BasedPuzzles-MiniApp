# PowerShell script to commit all changes (added, modified, deleted) with individual commit messages
# This script commits all changes for the Based Puzzles frontend project on Base Blockchain

# Get all changed files (staged, unstaged, untracked)
$files = git status --porcelain | ForEach-Object { $_.Substring(3) }

# Base message template
$baseMessage = "Updated {0} for Based Puzzles - Base-native web game hub with Sudoku and Crossword puzzles, track best times, climb leaderboards, Base Mini App, Smart Wallet connect for onchain identity and NFT rewards on Base blockchain"

foreach ($file in $files) {
    Write-Host "Committing $file..."
    git add $file
    $message = $baseMessage -f $file
    git commit -m $message
    git push
    Write-Host "Committed and pushed $file"
}

Write-Host "All changes committed individually and pushed. Ready to showcase contributions to Based Puzzles on Base blockchain with puzzle games, leaderboards, and onchain rewards."