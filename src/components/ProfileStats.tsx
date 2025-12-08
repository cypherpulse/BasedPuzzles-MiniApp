import { Trophy, Clock, Flame, Target, Grid3X3, AlignJustify } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTime, getPlayerTitle, type PlayerStats } from "@/lib/types";

interface ProfileStatsProps {
  stats: PlayerStats;
}

interface StatItemProps {
  icon: typeof Trophy;
  label: string;
  value: string | number;
  highlight?: boolean;
}

function StatItem({ icon: Icon, label, value, highlight }: StatItemProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 text-center">
      <Icon className={`w-5 h-5 mx-auto mb-2 ${highlight ? 'text-primary' : 'text-muted-foreground'}`} />
      <p className={`text-2xl font-bold ${highlight ? 'text-primary' : ''}`} data-testid={`stat-value-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const title = getPlayerTitle(stats);
  const totalGames = stats.sudoku.gamesCompleted + stats.crossword.gamesCompleted;

  return (
    <Card data-testid="profile-stats-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">Your Stats</CardTitle>
          <Badge variant="secondary" className="text-xs" data-testid="badge-player-title">
            {title}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <StatItem icon={Trophy} label="Total Games" value={totalGames} highlight />
          <StatItem icon={Flame} label="Day Streak" value={stats.streakDays} highlight={stats.streakDays > 0} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Grid3X3 className="w-4 h-4" />
            Sudoku
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatItem 
              icon={Target} 
              label="Completed" 
              value={stats.sudoku.gamesCompleted} 
            />
            <StatItem 
              icon={Clock} 
              label="Best Time" 
              value={stats.sudoku.bestTimeSeconds ? formatTime(stats.sudoku.bestTimeSeconds) : '--:--'} 
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <AlignJustify className="w-4 h-4" />
            Crossword
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatItem 
              icon={Target} 
              label="Completed" 
              value={stats.crossword.gamesCompleted} 
            />
            <StatItem 
              icon={Clock} 
              label="Best Time" 
              value={stats.crossword.bestTimeSeconds ? formatTime(stats.crossword.bestTimeSeconds) : '--:--'} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
