'use server';
import { generateFashionKeywords } from '@/ai/flows/generate-fashion-keywords';
import { provideFashionAssistance } from '@/ai/flows/provide-fashion-assistance';
import type { GenerateFashionKeywordsInput, GenerateFashionKeywordsOutput } from '@/ai/flows/generate-fashion-keywords';
import type { ProvideFashionAssistanceInput, ProvideFashionAssistanceOutput } from '@/ai/flows/provide-fashion-assistance';

export async function getFashionKeywordsAction(
  input: GenerateFashionKeywordsInput
): Promise<{ success: boolean; data?: GenerateFashionKeywordsOutput; error?: string }> {
  try {
    const result = await generateFashionKeywords(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating fashion keywords:', error);
    return { success: false, error: (error instanceof Error ? error.message : String(error)) };
  }
}

export async function getFashionAssistanceAction(
  input: ProvideFashionAssistanceInput
): Promise<{ success: boolean; data?: ProvideFashionAssistanceOutput; error?: string }> {
  try {
    const result = await provideFashionAssistance(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error providing fashion assistance:', error);
     return { success: false, error: (error instanceof Error ? error.message : String(error)) };
  }
}
