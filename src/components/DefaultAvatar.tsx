import { Bike, Dumbbell, Apple, Heart, Mountain, Footprints } from "lucide-react";
import React from "react";

const icons = [Bike, Dumbbell, Apple, Heart, Mountain, Footprints];

export interface DefaultAvatarProps {
  /** Seed value to deterministically pick an icon */
  seed?: string;
  /** Size of the avatar circle */
  size?: number;
  className?: string;
}

export default function DefaultAvatar({ seed = "", size = 32, className = "" }: DefaultAvatarProps) {
  const index = Array.from(seed).reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % icons.length;
  const IconComp = icons[index];
  const iconSize = Math.floor(size * 0.6);
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-muted text-muted-foreground ${className}`}
      style={{ width: size, height: size }}
    >
      <IconComp size={iconSize} />
    </div>
  );
}
