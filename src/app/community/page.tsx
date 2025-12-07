'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Users, PlusCircle } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  age: z.coerce.number().min(1, 'Age must be at least 1.'),
  bio: z.string().min(10, 'Bio must be at least 10 characters.'),
  image: z.string().url('Please enter a valid image URL.'),
  dataAiHint: z.string().optional(),
  isVIP: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function CommunityPage() {
  const router = useRouter();
  const { addProfile } = useAppContext();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      age: 18,
      bio: '',
      image: '',
      dataAiHint: '',
      isVIP: false,
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    setIsSubmitting(true);
    addProfile(data);
    toast({
      title: 'Profile Created!',
      description: `${data.name} has joined the Gorbagana meme chain.`,
    });
    router.push('/');
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex items-center gap-2 text-3xl font-bold text-primary mb-6 animate-float">
        <Users size={32} />
        <h1>Community Hub</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Create a New Profile</CardTitle>
          <CardDescription>
            Got a meme? A community? A vibe? Create a profile card and join the Gorbagana meme chain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Doge, Pepe, Your Community" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age / Years Active</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio / Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell everyone what your meme is about." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isVIP"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>VIP Status</FormLabel>
                      <p className="text-sm text-muted-foreground">VIP profiles get a gold border and badge.</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                <PlusCircle className="mr-2" />
                {isSubmitting ? 'Adding to the Chain...' : 'Create Profile'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
