"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { Profile, Chat, Message } from "@/lib/types";
import { initialProfiles } from "@/lib/data";
import { generateAiRecruiterResponse } from "@/ai/flows/generate-ai-recruiter-response";

type SwipeDirection = "left" | "right";

interface AppContextType {
  profiles: Profile[];
  userProfile: Profile;
  swipes: Record<string, SwipeDirection>;
  matches: Profile[];
  chats: Record<string, Chat>;
  handleSwipe: (profileId: string, direction: SwipeDirection) => void;
  sendMessage: (profileId: string, text: string) => Promise<void>;
  updateUserProfile: (updatedProfile: Profile) => void;
  addProfile: (newProfile: Omit<Profile, 'id' | 'stats' | 'isRecruiter'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [userProfile, setUserProfile] = useState<Profile>(profiles.find(p => p.isEditable)!);
  const [swipes, setSwipes] = useState<Record<string, SwipeDirection>>({});
  const [matches, setMatches] = useState<Profile[]>([]);
  const [chats, setChats] = useState<Record<string, Chat>>({});

  useEffect(() => {
    // On first load, check swipes to populate initial matches
    const initialMatches: Profile[] = [];
    const initialChats: Record<string, Chat> = {};
    for (const profileId in swipes) {
      if (swipes[profileId] === "right") {
        const profile = profiles.find((p) => p.id === profileId);
        if (profile) {
          initialMatches.push(profile);
          if (!initialChats[profileId]) {
            initialChats[profileId] = {
              id: `chat-${profileId}`,
              profileId,
              messages: [],
            };
          }
        }
      }
    }
    setMatches(initialMatches);
    setChats(initialChats);
  }, [profiles, swipes]);

  const handleSwipe = (profileId: string, direction: SwipeDirection) => {
    setSwipes((prev) => ({ ...prev, [profileId]: direction }));
    if (direction === "right") {
      const profile = profiles.find((p) => p.id === profileId);
      if (profile && !matches.some(m => m.id === profileId)) {
        setMatches((prev) => [...prev, profile]);
        if (!chats[profileId]) {
          setChats(prev => ({
            ...prev,
            [profileId]: { id: `chat-${profileId}`, profileId, messages: [] }
          }));
        }
      }
    }
  };

  const updateUserProfile = (updatedProfile: Profile) => {
    setUserProfile(updatedProfile);
  };

  const addProfile = (newProfileData: Omit<Profile, 'id' | 'stats' | 'isRecruiter'>) => {
    const newProfile: Profile = {
      ...newProfileData,
      id: `user-created-${Date.now()}`,
      stats: [
        { label: 'Community Rank', value: 'Newbie' },
        { label: 'Cred', value: 10 },
      ],
      isRecruiter: false,
    };
    setProfiles(prev => [newProfile, ...prev]);
  };

  const sendMessage = async (profileId: string, text: string) => {
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      senderId: 'user',
      timestamp: Date.now(),
    };

    setChats(prev => {
        const newChats = { ...prev };
        newChats[profileId].messages.push(userMessage);
        return newChats;
    });

    const matchedProfile = profiles.find(p => p.id === profileId);
    if (matchedProfile?.isRecruiter) {
        // Simulate thinking
        await new Promise(res => setTimeout(res, 1000 + Math.random() * 1000));
        
        const aiResponse = await generateAiRecruiterResponse({
            userMessage: text,
            profileName: matchedProfile.name,
        });

        const aiMessage: Message = {
            id: `msg-${Date.now()}-ai`,
            text: aiResponse.response,
            senderId: profileId,
            timestamp: Date.now(),
        };

        setChats(prev => {
            const newChats = { ...prev };
            newChats[profileId].messages.push(aiMessage);
            return newChats;
        });
    }
  };

  return (
    <AppContext.Provider
      value={{ profiles, userProfile, swipes, matches, chats, handleSwipe, sendMessage, updateUserProfile, addProfile }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
