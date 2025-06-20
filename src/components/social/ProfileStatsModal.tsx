"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui";
import { Button } from "@components/ui/button";
import { X } from "lucide-react";

interface Props {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export default function ProfileStatsModal({
  title,
  open,
  onOpenChange,
  children,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="relative max-w-md">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close"
          onClick={() => onOpenChange(false)}
          className="absolute top-2 right-2"
        >
          <X className="h-4 w-4" />
        </Button>
        <DialogHeader>
          <DialogTitle className="mb-2">{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-60 overflow-y-auto text-sm space-y-1">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
