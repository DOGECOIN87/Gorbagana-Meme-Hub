"use client";

import { SwipeDeck } from "@/components/swipe/SwipeDeck";
import { useAppContext } from "@/context/AppContext";
import { HeartCrack, Swords } from "lucide-react";
import { SplashScreen } from "@/components/layout/SplashScreen";

export default function Home() {
  const { profiles, swipes, handleSwipe, userProfile } = useAppContext();

  if (!userProfile) {
    return null; // Or a loading indicator
  }

  const swipedProfileIds = new Set(Object.keys(swipes));
  const profilesToSwipe = profiles.filter(p => !swipedProfileIds.has(p.id) && p.id !== userProfile.id);

  return (
    <>
      <SplashScreen />
      <div className="flex h-screen w-full flex-col items-center justify-center p-4">
        <div className="flex items-center gap-2 text-2xl font-bold text-primary mb-4 animate-float">
          <Swords size={28} />
          <h1>Gorbagana - the Meme Chain</h1>
        </div>
        {profilesToSwipe.length > 0 ? (
          <SwipeDeck profiles={profilesToSwipe} onSwipe={handleSwipe} />
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-96">
              <HeartCrack className="h-16 w-16 mb-4" />
              <h2 className="text-2xl font-bold">It's Over...</h2>
              <p>You've swiped through everyone.</p>
          </div>
        )}
      </div>
    </>
  );
}
