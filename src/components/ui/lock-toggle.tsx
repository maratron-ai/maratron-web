import { Lock, Unlock } from "lucide-react";
import { Button } from "./button";

interface LockToggleProps {
  locked: boolean;
  onChange?: (locked: boolean) => void;
  className?: string;
}

export default function LockToggle({ locked, onChange, className }: LockToggleProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      aria-label={locked ? "group is private" : "group is public"}
      onClick={() => onChange?.(!locked)}
    >
      {locked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
    </Button>
  );
}
