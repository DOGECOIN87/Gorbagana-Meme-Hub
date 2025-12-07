"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User, Wand2, Save, Edit, Link as LinkIcon, ExternalLink, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateInitialProfileBio } from "@/ai/flows/generate-initial-profile-bio";
import type { Profile } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { id: profileId } = useParams();
  const { profiles, userProfile, updateUserProfile } = useAppContext();
  const { toast } = useToast();
  const router = useRouter();
  
  const isUser = !profileId || profileId === userProfile.id;
  const profile = isUser ? userProfile : profiles.find(p => p.id === profileId);

  const [isEditing, setIsEditing] = useState(isUser && profile?.isEditable);
  const [editedProfile, setEditedProfile] = useState<Profile | undefined>(profile);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  if (!profile || !editedProfile) {
    return <div>Profile not found</div>
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => prev ? ({ ...prev, [name]: value }) : undefined);
  };
  
  const handleSave = () => {
    if (editedProfile) {
      updateUserProfile(editedProfile);
      setIsEditing(false);
      toast({
          title: "Profile Updated",
          description: "Your new look has been saved to the mainframe.",
      });
    }
  };

  const handleGenerateBio = async () => {
    if (!editedProfile) return;
    setIsGeneratingBio(true);
    try {
        const result = await generateInitialProfileBio({ prompt: editedProfile.name });
        setEditedProfile(prev => prev ? ({...prev, bio: result.bio}) : undefined);
    } catch(err) {
        toast({
            variant: "destructive",
            title: "AI Error",
            description: "Could not generate bio. The AI might be mogging.",
        });
    } finally {
        setIsGeneratingBio(false);
    }
  }

  const currentProfile = isEditing ? editedProfile : profile;
  
  return (
    <div className="container mx-auto p-4">
      <header className="flex items-center justify-between gap-2 text-3xl font-bold text-primary mb-6">
        <div className="flex items-center gap-2 animate-float">
            <User size={32} />
            <h1>{isUser ? 'Your Profile' : `${currentProfile.name}'s Profile`}</h1>
        </div>
        {isUser && !isEditing && currentProfile.isEditable && (
            <Button variant="ghost" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4"/>
                Edit
            </Button>
        )}
      </header>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <Card>
                <CardContent className="p-6 flex flex-col items-center">
                    <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-accent shadow-lg">
                        <Image src={currentProfile.image} alt={currentProfile.name} fill sizes="160px" className="object-cover" data-ai-hint={currentProfile.dataAiHint} />
                        {currentProfile.isVIP && (
                            <div className="absolute bottom-0 right-0 bg-yellow-400 p-2 rounded-full border-4 border-card">
                                <Crown className="text-black" size={24}/>
                            </div>
                        )}
                    </div>
                    <div className="text-center mt-4">
                        <h2 className="text-2xl font-bold">{currentProfile.name}</h2>
                        {currentProfile.isVIP && <Badge className="mt-1 bg-yellow-400 text-black hover:bg-yellow-500">VIP</Badge>}
                        <p className="text-muted-foreground">{currentProfile.age} years old</p>
                    </div>
                </CardContent>
            </Card>

            {(currentProfile.id === 'user-01' || currentProfile.id === 'user-09' || currentProfile.id === 'user-10' || currentProfile.id === 'user-12' || currentProfile.id === 'user-14' || currentProfile.id === 'user-16' || currentProfile.id === 'user-17' || currentProfile.id === 'user-18' || currentProfile.id === 'user-19' || currentProfile.id === 'user-20') && (
                <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><LinkIcon /> Community</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                    <Link href={
                        currentProfile.id === 'user-01' ? "https://Gorbagana.wtf" :
                        currentProfile.id === 'user-09' ? "https://www.google.com/search?q=CarolineEllison" :
                        currentProfile.id === 'user-10' ? "https://gorbhouse.wtf" :
                        currentProfile.id === 'user-12' ? "https://magiceden.us/marketplace/gorbagio?gr" :
                        currentProfile.id === 'user-14' ? "https://trashcoin.wtf/" :
                        currentProfile.id === 'user-16' ? "https://gorid.com/" :
                        currentProfile.id === 'user-17' ? "https://www.gorboy.wtf/" :
                        currentProfile.id === 'user-18' ? "https://backpack.app/" :
                        currentProfile.id === 'user-19' ? "https://gorbag.vercel.app" :
                        "https://Gor-incinerator.com"
                    } target="_blank">
                        {currentProfile.id === 'user-01' ? 'Gorbagana Website' : 
                         currentProfile.id === 'user-10' ? 'Gorbhouse Website' : 
                         currentProfile.id === 'user-12' ? 'View on Magic Eden' :
                         currentProfile.id === 'user-14' ? 'Trashcoin Website' :
                         currentProfile.id === 'user-16' ? 'GORID Website' :
                         currentProfile.id === 'user-17' ? 'GORBOY Website' :
                         currentProfile.id === 'user-18' ? 'Backpack Wallet' :
                         currentProfile.id === 'user-19' ? 'GORBAG Website' :
                         currentProfile.id === 'user-20' ? 'Gor-incinerator Website' :
                         'Learn More'}
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                    </Button>
                </CardContent>
                </Card>
            )}

            {currentProfile.id === 'user-11' && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon /> Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <Button asChild className="w-full">
                    <Link href="https://lex-node.github.io/sustain/" target="_blank">
                      Website <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild className="w-full" variant="secondary">
                    <Link href="https://x.com/lex_node" target="_blank">
                      X.com Profile <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {currentProfile.id === 'user-22' && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon /> Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <Button asChild className="w-full">
                    <Link href="https://www.tiktok.com/t/ZTHw8VLSRYUQ5-cKaWy/" target="_blank">
                      TikTok <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild className="w-full" variant="secondary">
                    <Link href="https://looksmax.org/" target="_blank">
                      Website <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="https://apps.apple.com/us/app/looksmax-ai/id6474518292" target="_blank">
                      App Store <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentProfile.id === 'user-15' && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon /> Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <Button asChild className="w-full">
                    <Link href="https://trashbin.fun" target="_blank">
                      Website <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild className="w-full" variant="secondary">
                    <Link href="https://x.com/TrashBinGOR" target="_blank">
                      X.com Profile <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentProfile.id === 'user-08' && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><LinkIcon /> Token Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground break-all mb-4">
                    <p className="font-bold text-foreground">Token</p>
                    <p>{currentProfile.stats.find(s => s.label === 'Token')?.value}</p>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`https://trashscan.io/token/${currentProfile.stats.find(s => s.label === 'Token')?.value}`} target="_blank">
                      View on Trashscan <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Mogging Stats</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {currentProfile.stats
                            .filter(stat => stat.label !== 'Token') // Don't show token here
                            .map(stat => (
                            <li key={stat.label} className="flex justify-between items-center text-sm">
                                <span className="font-semibold text-muted-foreground">{stat.label}</span>
                                <span className="font-mono font-bold text-primary p-1 bg-primary/10 rounded">{stat.value}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={currentProfile.name} onChange={handleInputChange} disabled={!isEditing} />
                   </div>
                   <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" name="age" type="number" value={currentProfile.age} onChange={handleInputChange} disabled={!isEditing} />
                   </div>
                   <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" name="bio" value={currentProfile.bio} onChange={handleInputChange} disabled={!isEditing} rows={4} />
                        {isEditing && (
                            <Button variant="outline" size="sm" onClick={handleGenerateBio} disabled={isGeneratingBio} className="w-full mt-2">
                                <Wand2 className="mr-2 h-4 w-4"/>
                                {isGeneratingBio ? "Generating..." : "Generate Bio with AI"}
                            </Button>
                        )}
                   </div>

                   {isEditing && (
                    <Button onClick={handleSave} className="w-full" size="lg">
                        <Save className="mr-2 h-5 w-5" />
                        Save Changes
                    </Button>
                   )}

                   {!isUser && (
                     <Button onClick={() => router.back()} className="w-full" variant="secondary">
                        Back
                     </Button>
                   )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
    
