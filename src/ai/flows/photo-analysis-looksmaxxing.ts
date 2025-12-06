'use server';

/**
 * @fileOverview A humorous photo analysis flow for looksmaxxing advice.
 *
 * - analyzePhotoForLooksmaxxing - A function that handles the photo analysis process.
 * - AnalyzePhotoForLooksmaxxingInput - The input type for the analyzePhotoForLooksmaxxing function.
 * - AnalyzePhotoForLooksmaxxingOutput - The return type for the analyzePhotoForLooksmaxxing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePhotoForLooksmaxxingInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzePhotoForLooksmaxxingInput = z.infer<typeof AnalyzePhotoForLooksmaxxingInputSchema>;

const AnalyzePhotoForLooksmaxxingOutputSchema = z.object({
  advice: z.string().describe('Humorous looksmaxxing advice tailored to the Gorbagana community.'),
});
export type AnalyzePhotoForLooksmaxxingOutput = z.infer<typeof AnalyzePhotoForLooksmaxxingOutputSchema>;

export async function analyzePhotoForLooksmaxxing(input: AnalyzePhotoForLooksmaxxingInput): Promise<AnalyzePhotoForLooksmaxxingOutput> {
  return analyzePhotoForLooksmaxxingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePhotoForLooksmaxxingPrompt',
  input: {schema: AnalyzePhotoForLooksmaxxingInputSchema},
  output: {schema: AnalyzePhotoForLooksmaxxingOutputSchema},
  prompt: `You are a humorous advisor providing looksmaxxing advice tailored to members of the Gorbagana community.

  Analyze the following photo and provide funny, sarcastic, and engaging tips for improving the subject's profile.  Emphasize aspects that would resonate with the Gorbagana community.
  Photo: {{media url=photoDataUri}}
  `,
});

const analyzePhotoForLooksmaxxingFlow = ai.defineFlow(
  {
    name: 'analyzePhotoForLooksmaxxingFlow',
    inputSchema: AnalyzePhotoForLooksmaxxingInputSchema,
    outputSchema: AnalyzePhotoForLooksmaxxingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
