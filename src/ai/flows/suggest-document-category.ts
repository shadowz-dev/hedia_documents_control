'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting document categories and tags based on document content.
 *
 * - suggestDocumentCategory - A function that takes document data URI as input and returns suggested categories and tags.
 * - SuggestDocumentCategoryInput - The input type for the suggestDocumentCategory function.
 * - SuggestDocumentCategoryOutput - The return type for the suggestDocumentCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDocumentCategoryInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The document's data, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestDocumentCategoryInput = z.infer<
  typeof SuggestDocumentCategoryInputSchema
>;

const SuggestDocumentCategoryOutputSchema = z.object({
  suggestedCategory: z
    .string()
    .describe('The AI-suggested category for the document.'),
  suggestedTags: z
    .array(z.string())
    .describe('The AI-suggested tags for the document.'),
});
export type SuggestDocumentCategoryOutput = z.infer<
  typeof SuggestDocumentCategoryOutputSchema
>;

export async function suggestDocumentCategory(
  input: SuggestDocumentCategoryInput
): Promise<SuggestDocumentCategoryOutput> {
  return suggestDocumentCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDocumentCategoryPrompt',
  input: {schema: SuggestDocumentCategoryInputSchema},
  output: {schema: SuggestDocumentCategoryOutputSchema},
  prompt: `You are an AI assistant designed to suggest document categories and tags based on the content of the document.

  Analyze the document provided in the data URI, extract relevant information, and suggest a category and relevant tags for it.

  Respond with a JSON object containing the suggested category and an array of suggested tags.  The suggested tags should be relevant to the document's content.

  Here is the document data:
  {{media url=documentDataUri}}
  `,
});

const suggestDocumentCategoryFlow = ai.defineFlow(
  {
    name: 'suggestDocumentCategoryFlow',
    inputSchema: SuggestDocumentCategoryInputSchema,
    outputSchema: SuggestDocumentCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
