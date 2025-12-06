"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User, Wand2, Save, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateInitialProfileBio } from "@/ai/flows/generate-initial-profile-bio";
import type { Profile } from "@/lib/types";

export default function ProfilePage() {
  const { userProfile, updateUserProfile } = useAppContext();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(userProfile.isEditable);
  const [editedProfile, setEditedProfile] = useState<Profile>(userProfile);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    updateUserProfile(editedProfile);
    setIsEditing(false);
    toast({
        title: "Profile Updated",
        description: "Your new look has been saved to the mainframe.",
    });
  };

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    try {
        const result = await generateInitialProfileBio({ prompt: editedProfile.name });
        setEditedProfile(prev => ({...prev, bio: result.bio}));
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

  const currentProfile = isEditing ? editedProfile : userProfile;

  return (
    <div className="container mx-auto p-4">
      <header className="flex items-center justify-between gap-2 text-3xl font-bold text-primary mb-6">
        <div className="flex items-center gap-2 animate-float">
            <User size={32} />
            <h1>Your Profile</h1>
        </div>
        {!isEditing && userProfile.isEditable && (
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
                    </div>
                    <h2 className="text-2xl font-bold mt-4">{currentProfile.name}</h2>
                    <p className="text-muted-foreground">{currentProfile.age} years old</p>
                </CardContent>
            </Card>
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Mogging Stats</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {currentProfile.stats.map(stat => (
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
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
