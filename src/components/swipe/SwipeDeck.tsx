"use client";

import { useState } from "react";
import type { Profile } from "@/lib/types";
import { ProfileCard } from "./ProfileCard";

interface SwipeDeckProps {
  profiles: Profile[];
  onSwipe: (profileId: string, direction: "left" | "right") => void;
}

export function SwipeDeck({ profiles, onSwipe }: SwipeDeckProps) {
  const [stack, setStack] = useState(profiles);

  const handleSwipe = (profileId: string, direction: "left" | "right") => {
    onSwipe(profileId, direction);
    // Remove the card from the top of the stack
    setStack((prev) => prev.filter((p) => p.id !== profileId));
  };

  return (
    <div className="relative w-full h-[500px] max-w-sm">
      {stack.map((profile, index) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          onSwipe={(dir) => handleSwipe(profile.id, dir)}
          isTop={index === stack.length - 1}
        />
      ))}
    </div>
  );
}
