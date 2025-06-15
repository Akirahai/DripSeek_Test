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
  context: z.string().optional().describe('Additional context for the question.'),
});
export type ProvideFashionAssistanceInput = z.infer<typeof ProvideFashionAssistanceInputSchema>;

const ProvideFashionAssistanceOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question.'),
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
  Context: {{{context}}}
  {{/if}}
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
