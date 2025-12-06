"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const { profiles, chats, sendMessage } = useAppContext();
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const profileId = Array.isArray(id) ? id[0] : id;
  const profile = profiles.find((p) => p.id === profileId);
  const chat = chats[profileId];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat?.messages]);

  const handleSend = async () => {
    if (inputValue.trim() && profileId && !isSending) {
      setIsSending(true);
      const messageToSend = inputValue;
      setInputValue("");
      await sendMessage(profileId, messageToSend);
      setIsSending(false);
    }
  };

  if (!profile || !chat) {
    return (
      <div className="flex h-screen items-center justify-center text-destructive">
        Error: Chat or profile not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center gap-4 p-2 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <Button variant="ghost" size="icon" onClick={() => router.push('/matches')}>
          <ArrowLeft />
        </Button>
        <Link href={`/profile/${profileId}`} className="flex items-center gap-2">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-accent">
              <Image src={profile.image} alt={profile.name} fill sizes="40px" className="object-cover" data-ai-hint={profile.dataAiHint} />
            </div>
            <h2 className="font-bold text-lg">{profile.name}</h2>
        </Link>
      </header>

      <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 font-code">
        <div className="flex flex-col gap-4">
          <div className="text-center text-xs text-muted-foreground p-4 border border-dashed border-accent/50 rounded-lg">
            <p className="font-bold text-accent glitch-text">SECURE CONNECTION ESTABLISHED</p>
            <p>You matched with {profile.name} on {new Date().toLocaleDateString()}.</p>
            {profile.isRecruiter && <p className="text-accent/80">This is a recruiter profile. Replies are AI-generated.</p>}
          </div>

          {chat.messages.map((message, index) => (
            <ChatMessage key={message.id} message={message} profile={profile} />
          ))}
          {isSending && <div className="self-start flex gap-2 items-center text-sm text-muted-foreground animate-pulse">
            <Terminal className="h-4 w-4 text-primary" />
            <span>{profile.name} is typing...</span>
          </div>}
        </div>
      </div>

      <footer className="p-2 border-t sticky bottom-0 bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow bg-card focus:ring-accent font-code"
            disabled={isSending}
          />
          <Button type="submit" size="icon" disabled={!inputValue.trim() || isSending}>
            <Send />
          </Button>
        </form>
      </footer>
    </div>
  );
}


function ChatMessage({ message, profile }: { message: Message; profile: any }) {
  const isUser = message.senderId === 'user';
  return (
    <div className={cn("flex items-end gap-2", isUser ? "self-end flex-row-reverse" : "self-start")}>
        <div className={cn("max-w-xs md:max-w-md p-3 rounded-lg text-sm", 
            isUser ? "bg-accent text-accent-foreground" : "bg-card border")}>
            <p>{message.text}</p>
        </div>
    </div>
  );
}
