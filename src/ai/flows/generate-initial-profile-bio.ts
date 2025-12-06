'use server';

/**
 * @fileOverview Generates a funny and satirical initial profile bio for new users.
 *
 * - generateInitialProfileBio - A function that generates the profile bio.
 * - GenerateInitialProfileBioInput - The input type for the generateInitialProfileBio function.
 * - GenerateInitialProfileBioOutput - The return type for the generateInitialProfileBio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialProfileBioInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A prompt or theme to base the profile bio on, like a specific character or meme.'
    ),
});
export type GenerateInitialProfileBioInput = z.infer<
  typeof GenerateInitialProfileBioInputSchema
>;

const GenerateInitialProfileBioOutputSchema = z.object({
  bio: z.string().describe('The generated profile bio.'),
});
export type GenerateInitialProfileBioOutput = z.infer<
  typeof GenerateInitialProfileBioOutputSchema
>;

export async function generateInitialProfileBio(
  input: GenerateInitialProfileBioInput
): Promise<GenerateInitialProfileBioOutput> {
  return generateInitialProfileBioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialProfileBioPrompt',
  input: {schema: GenerateInitialProfileBioInputSchema},
  output: {schema: GenerateInitialProfileBioOutputSchema},
  prompt: `You are a satirical profile bio generator for a looksmaxxing and \"Gorbagana\" themed app. Generate a funny and engaging profile bio based on the following prompt or theme: {{{prompt}}}. The profile bio should reflect a humorous and ironic take on the provided theme. Keep it short and punchy.
`,
});

const generateInitialProfileBioFlow = ai.defineFlow(
  {
    name: 'generateInitialProfileBioFlow',
    inputSchema: GenerateInitialProfileBioInputSchema,
    outputSchema: GenerateInitialProfileBioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
