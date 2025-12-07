"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { collection, doc, getDoc, getDocs, setDoc, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
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

const USER_ID = "user-profile-01"; // Hardcoded user ID for this example

export function AppProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [swipes, setSwipes] = useState<Record<string, SwipeDirection>>({});
  const [matches, setMatches] = useState<Profile[]>([]);
  const [chats, setChats] = useState<Record<string, Chat>>({});
  const [loading, setLoading] = useState(true);

  // Function to seed initial data if profiles collection is empty
  const seedInitialData = useCallback(async () => {
    const profilesCollection = collection(db, "profiles");
    const snapshot = await getDocs(profilesCollection);
    if (snapshot.empty) {
      console.log("Seeding initial profiles to Firestore...");
      const batch = [];
      for (const profile of initialProfiles) {
        const profileRef = doc(db, "profiles", profile.id);
        batch.push(setDoc(profileRef, profile));
      }
      await Promise.all(batch);
      console.log("Seeding complete.");
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await seedInitialData();

      // Setup profile listener
      const profileUnsubscribe = onSnapshot(collection(db, "profiles"), (snapshot) => {
        const profilesData = snapshot.docs.map(doc => doc.data() as Profile);
        setProfiles(profilesData);
        
        const mainUserProfile = profilesData.find(p => p.id === USER_ID);
        if (mainUserProfile) {
          setUserProfile(mainUserProfile);
        }
      });
      
      // Fetch user's swipes, matches, and chats
      const userRef = doc(db, "users", USER_ID);
      const swipesRef = collection(userRef, "swipes");
      const matchesRef = collection(userRef, "matches");
      
      const swipesSnapshot = await getDocs(swipesRef);
      const swipesData: Record<string, SwipeDirection> = {};
      swipesSnapshot.forEach(doc => {
        swipesData[doc.id] = doc.data().direction;
      });
      setSwipes(swipesData);

      const matchesSnapshot = await getDocs(matchesRef);
      const matchPromises = matchesSnapshot.docs.map(async (d) => {
        const profileDoc = await getDoc(doc(db, "profiles", d.id));
        if (profileDoc.exists()) {
          return profileDoc.data() as Profile;
        }
        return null;
      });
      const matchesData = (await Promise.all(matchPromises)).filter((p): p is Profile => p !== null);
      setMatches(matchesData);
      
      // Setup chats listener
      const chatsQuery = query(collection(db, "chats"), where("participants", "array-contains", USER_ID));
      const chatUnsubscribe = onSnapshot(chatsQuery, (snapshot) => {
        const chatsData: Record<string, Chat> = {};
        snapshot.forEach(doc => {
          const chat = doc.data() as Chat;
          const otherParticipantId = chat.participants.find(p => p !== USER_ID)!;
          chatsData[otherParticipantId] = { ...chat, id: doc.id };
        });
        setChats(chatsData);
      });

      setLoading(false);
      return () => {
        profileUnsubscribe();
        chatUnsubscribe();
      };
    }

    const unsubscribePromise = loadData();

    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe());
    };
  }, [seedInitialData]);


  const handleSwipe = async (profileId: string, direction: SwipeDirection) => {
    const swipeRef = doc(db, "users", USER_ID, "swipes", profileId);
    await setDoc(swipeRef, { direction });
    setSwipes((prev) => ({ ...prev, [profileId]: direction }));

    if (direction === "right") {
      const matchRef = doc(db, "users", USER_ID, "matches", profileId);
      await setDoc(matchRef, { matchedAt: new Date() });

      const profile = profiles.find((p) => p.id === profileId);
      if (profile && !matches.some(m => m.id === profileId)) {
        setMatches((prev) => [...prev, profile]);

        // Check if a chat document exists, if not create one
        const chatQuery = query(collection(db, "chats"), where("participants", "in", [[USER_ID, profileId], [profileId, USER_ID]]));
        const chatSnapshot = await getDocs(chatQuery);
        if (chatSnapshot.empty) {
            await addDoc(collection(db, "chats"), {
                participants: [USER_ID, profileId],
                messages: [],
            });
        }
      }
    }
  };

  const updateUserProfile = async (updatedProfile: Profile) => {
    if(!userProfile) return;
    const userDocRef = doc(db, "profiles", userProfile.id);
    await setDoc(userDocRef, updatedProfile, { merge: true });
    setUserProfile(updatedProfile);
  };

  const addProfile = async (newProfileData: Omit<Profile, 'id' | 'stats' | 'isRecruiter' | 'isEditable'>) => {
    const newId = `user-created-${Date.now()}`;
    const newProfile: Profile = {
      ...newProfileData,
      id: newId,
      stats: [
        { label: 'Community Rank', value: 'Newbie' },
        { label: 'Cred', value: 10 },
      ],
      isRecruiter: false,
      isEditable: true, // User created profiles should be editable
    };
    await setDoc(doc(db, "profiles", newId), newProfile);
  };

  const sendMessage = async (profileId: string, text: string) => {
    const chat = Object.values(chats).find(c => c.participants.includes(profileId));
    if (!chat) return;

    const chatRef = doc(db, "chats", chat.id);

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      senderId: USER_ID,
      timestamp: Date.now(),
    };
    
    const updatedMessages = [...chat.messages, userMessage];
    await setDoc(chatRef, { messages: updatedMessages }, { merge: true });

    const matchedProfile = profiles.find(p => p.id === profileId);
    if (matchedProfile?.isRecruiter) {
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
      
      await setDoc(chatRef, { messages: [...updatedMessages, aiMessage] }, { merge: true });
    }
  };

  // While loading, we can show a blank screen or a loader
  if (loading || !userProfile) {
    return null; // Or a proper loader component
  }

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
