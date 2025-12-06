"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Profile } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Info, Crown } from "lucide-react";

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}

const SWIPE_THRESHOLD = 120;
const MAX_ROTATION = 20;

export function ProfileCard({ profile, onSwipe, isTop }: ProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isTop) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    cardRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !isTop) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    setPosition({ x: dx, y: dy });
    setRotation((dx / window.innerWidth) * MAX_ROTATION * 2);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !isTop) return;
    setIsDragging(false);
    cardRef.current?.releasePointerCapture(e.pointerId);
    
    if (Math.abs(position.x) > SWIPE_THRESHOLD) {
      const direction = position.x > 0 ? "right" : "left";
      onSwipe(direction);
    } else {
      // Return to center
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }
  };
  
  const opacity = Math.min(Math.abs(position.x) / SWIPE_THRESHOLD, 1);
  const rightOpacity = position.x > 0 ? opacity : 0;
  const leftOpacity = position.x < 0 ? opacity : 0;

  return (
    <Card
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        "absolute w-full h-[500px] select-none overflow-hidden border-2 border-border shadow-lg shadow-accent/10",
        isTop && "cursor-grab",
        isDragging && "cursor-grabbing",
        profile.isVIP && "border-yellow-400"
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
      }}
    >
      <div className="relative h-full w-full">
        <Image
          src={profile.image}
          alt={profile.name}
          fill
          sizes="(max-width: 640px) 100vw, 384px"
          className="object-cover"
          data-ai-hint={profile.dataAiHint}
          priority={isTop}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {profile.isVIP && (
          <div className="absolute top-4 left-4 text-yellow-400 bg-black/50 rounded-full p-2">
            <Crown size={24} />
          </div>
        )}

        <Link href={`/profile/${profile.id}`} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          onClick={(e) => e.stopPropagation()} // Prevents card drag
        >
            <Info size={24} />
        </Link>
        
        <div 
            className="absolute top-8 left-8 -rotate-12 transform text-5xl font-bold border-4 border-primary text-primary uppercase tracking-widest p-2"
            style={{ opacity: rightOpacity }}
        >
            Mog
        </div>
        <div 
            className="absolute top-8 right-8 rotate-12 transform text-4xl font-bold border-4 border-destructive text-destructive uppercase tracking-widest p-2"
            style={{ opacity: leftOpacity }}
        >
            It's Over
        </div>

        <CardContent className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            {profile.name}
            <span className="font-light">{profile.age}</span>
          </h2>
          <p className="text-sm text-white/80 mt-1 line-clamp-2">{profile.bio}</p>
        </CardContent>
      </div>
    </Card>
  );
}
