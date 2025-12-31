"use client";

import { cn } from "@/lib/utils";

interface TransactionAvatarProps {
  name: string;
  className?: string;
}

const COLORS = [
  "bg-orange-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-indigo-500",
];

export function TransactionAvatar({ name, className }: TransactionAvatarProps) {
  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getColor = (name: string): string => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLORS[Math.abs(hash) % COLORS.length];
  };

  const initials = getInitials(name);
  const colorClass = getColor(name);

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full text-white text-xs font-semibold",
        colorClass,
        className || "w-10 h-10"
      )}
    >
      {initials}
    </div>
  );
}

