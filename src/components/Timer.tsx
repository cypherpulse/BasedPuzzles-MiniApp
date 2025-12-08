import { Clock } from "lucide-react";
import { formatTime } from "@/lib/types";

interface TimerProps {
  seconds: number;
  isRunning?: boolean;
}

export function Timer({ seconds, isRunning = true }: TimerProps) {
  return (
    <div 
      className="flex items-center gap-2 bg-muted rounded-lg px-4 py-3" 
      data-testid="timer-display"
    >
      <Clock className={`w-5 h-5 ${isRunning ? 'text-primary' : 'text-muted-foreground'}`} />
      <span 
        className="text-2xl font-mono tabular-nums font-medium" 
        data-testid="text-timer-value"
      >
        {formatTime(seconds)}
      </span>
    </div>
  );
}
