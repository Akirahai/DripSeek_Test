
'use server';

/**
 * @fileOverview A flow to generate fashion keywords from an image.
 *
 * - generateFashionKeywords - A function that handles the generation of fashion keywords.
 * - GenerateFashionKeywordsInput - The input type for the generateFashionKeywords function.
 * - GenerateFashionKeywordsOutput - The return type for the generateFashionKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFashionKeywordsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a scene, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateFashionKeywordsInput = z.infer<
  typeof GenerateFashionKeywordsInputSchema
>;

const GenerateFashionKeywordsOutputSchema = z.object({
  keywords: z
    .string()
    .describe(
      'Keywords extracted from the image that describe the fashion items present.'
    ),
});
export type GenerateFashionKeywordsOutput = z.infer<
  typeof GenerateFashionKeywordsOutputSchema
>;

export async function generateFashionKeywords(
  input: GenerateFashionKeywordsInput
): Promise<GenerateFashionKeywordsOutput> {
  return generateFashionKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFashionKeywordsPrompt',
  input: {schema: GenerateFashionKeywordsInputSchema},
  output: {schema: GenerateFashionKeywordsOutputSchema},
  prompt: `You are a fashion expert. Extract keywords that describe the fashion items present in the following image. Only extract keywords related to fashion.

Image: {{media url=photoDataUri}}

Keywords: `,
});

const generateFashionKeywordsFlow = ai.defineFlow(
  {
    name: 'generateFashionKeywordsFlow',
    inputSchema: GenerateFashionKeywordsInputSchema,
    outputSchema: GenerateFashionKeywordsOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    const output = response.output;
    if (!output) {
      console.error('Generate fashion keywords flow did not receive a valid output from the prompt.');
      throw new Error('AI model did not provide a valid response structure for keywords.');
    }
    return output;
  }
);

