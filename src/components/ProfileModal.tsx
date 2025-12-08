import { useState } from "react";
import { User, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileStats } from "@/components/ProfileStats";
import type { PlayerStats } from "@/lib/types";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onUpdateName: (name: string) => void;
}

export function ProfileModal({ open, onClose, stats, onUpdateName }: ProfileModalProps) {
  const [name, setName] = useState(stats.playerName || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (name.trim()) {
      onUpdateName(name.trim());
      setIsEditing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="profile-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Your Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Display Name</Label>
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={20}
                  data-testid="input-profile-name"
                />
                <Button onClick={handleSave} size="icon" data-testid="button-save-name">
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 p-3 bg-muted rounded-lg">
                <span className="font-medium" data-testid="text-display-name">
                  {stats.playerName || 'Player'}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setName(stats.playerName || '');
                    setIsEditing(true);
                  }}
                  data-testid="button-edit-name"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>

          <ProfileStats stats={stats} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
