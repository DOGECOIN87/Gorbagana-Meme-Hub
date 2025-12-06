'use server';
/**
 * @fileOverview Generates an AI-powered response from a recruiter profile, emphasizing technical skills and community engagement.
 *
 * - generateAiRecruiterResponse - A function that generates the AI recruiter response.
 * - GenerateAiRecruiterResponseInput - The input type for the generateAiRecruiterResponse function.
 * - GenerateAiRecruiterResponseOutput - The return type for the generateAiRecruiterResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiRecruiterResponseInputSchema = z.object({
  userMessage: z.string().describe('The user message to generate a response to.'),
  profileName: z.string().describe('The name of the recruiter profile.'),
});
export type GenerateAiRecruiterResponseInput = z.infer<typeof GenerateAiRecruiterResponseInputSchema>;

const GenerateAiRecruiterResponseOutputSchema = z.object({
  response: z.string().describe('The AI-generated response from the recruiter profile.'),
});
export type GenerateAiRecruiterResponseOutput = z.infer<typeof GenerateAiRecruiterResponseOutputSchema>;

export async function generateAiRecruiterResponse(input: GenerateAiRecruiterResponseInput): Promise<GenerateAiRecruiterResponseOutput> {
  return generateAiRecruiterResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiRecruiterResponsePrompt',
  input: {schema: GenerateAiRecruiterResponseInputSchema},
  output: {schema: GenerateAiRecruiterResponseOutputSchema},
  prompt: `You are responding as {{profileName}}, a recruiter. Your responses should emphasize the user's technical skills and potential contribution to the Gorbagana community, while maintaining a comedic and satirical tone.

User message: {{{userMessage}}}

Response: `,
});

const generateAiRecruiterResponseFlow = ai.defineFlow(
  {
    name: 'generateAiRecruiterResponseFlow',
    inputSchema: GenerateAiRecruiterResponseInputSchema,
    outputSchema: GenerateAiRecruiterResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
