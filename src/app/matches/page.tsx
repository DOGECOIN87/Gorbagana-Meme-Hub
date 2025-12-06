"use client";

import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { MessageSquare, Swords } from "lucide-react";

export default function MatchesPage() {
  const { matches, chats } = useAppContext();

  return (
    <div className="container mx-auto p-4">
      <header className="flex items-center gap-2 text-3xl font-bold text-primary mb-6 animate-float">
        <Swords size={32} />
        <h1>Your Connections</h1>
      </header>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-96">
            <MessageSquare className="h-16 w-16 mb-4" />
            <h2 className="text-2xl font-bold">No Connections Yet</h2>
            <p>Go mog some profiles to start a conversation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {matches.map((match) => {
            const lastMessage = chats[match.id]?.messages.slice(-1)[0];
            return (
              <Link href={`/matches/${match.id}`} key={match.id}>
                <Card className="p-3 hover:bg-card/80 transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-accent">
                      <Image
                        src={match.image}
                        alt={match.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                        data-ai-hint={match.dataAiHint}
                      />
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <h3 className="text-lg font-bold truncate">{match.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {lastMessage ? 
                          (lastMessage.senderId === 'user' ? 'You: ' : '') + lastMessage.text :
                          `You matched with ${match.name}. Say hi!`}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
