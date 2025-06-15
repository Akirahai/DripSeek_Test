// src/ai/flows/provide-fashion-assistance.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing fashion assistance to users.
 *
 * - provideFashionAssistance - A function that handles the fashion assistance process.
 * - ProvideFashionAssistanceInput - The input type for the provideFashionAssistance function.
 * - ProvideFashionAssistanceOutput - The return type for the provideFashionAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideFashionAssistanceInputSchema = z.object({
  question: z.string().describe('The user question about fashion.'),
  context: z.string().optional().describe('Additional context for the question, typically fashion keywords.'),
});
export type ProvideFashionAssistanceInput = z.infer<typeof ProvideFashionAssistanceInputSchema>;

const ProvideFashionAssistanceOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question.'),
  searchLink: z.string().url().optional().describe('A URL to search for identified fashion items, e.g., on an e-commerce site like Amazon. This link should be constructed using keywords from the context if provided and relevant.'),
});
export type ProvideFashionAssistanceOutput = z.infer<typeof ProvideFashionAssistanceOutputSchema>;

export async function provideFashionAssistance(input: ProvideFashionAssistanceInput): Promise<ProvideFashionAssistanceOutput> {
  return provideFashionAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideFashionAssistancePrompt',
  input: {schema: ProvideFashionAssistanceInputSchema},
  output: {schema: ProvideFashionAssistanceOutputSchema},
  prompt: `You are a helpful AI assistant specializing in fashion.

Answer the following question based on your knowledge of fashion trends, styles, and brands.

Question: {{{question}}}

{{#if context}}
Context from DripSeek (fashion keywords identified from an image): {{{context}}}
Based on these keywords, if relevant to the user's question or as additional helpful information, please try to generate a search link for a major e-commerce site (like Amazon).
For example, if keywords are "red silk dress", the search link could be "https://www.amazon.com/s?k=red+silk+dress".
Incorporate this link naturally into your answer if you generate one, and ensure the link is populated in the 'searchLink' field of the output. If no specific question is asked but context is provided, you can proactively offer a search link.
{{/if}}

Answer:
`,
});

const provideFashionAssistanceFlow = ai.defineFlow(
  {
    name: 'provideFashionAssistanceFlow',
    inputSchema: ProvideFashionAssistanceInputSchema,
    outputSchema: ProvideFashionAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
