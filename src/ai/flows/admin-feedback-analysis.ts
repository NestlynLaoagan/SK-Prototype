'use server';

/**
 * @fileOverview Analyzes user feedback and provides sentiment statistics for admin review.
 *
 * - analyzeFeedback - A function that analyzes feedback and returns sentiment statistics.
 * - AnalyzeFeedbackInput - The input type for the analyzeFeedback function.
 * - AnalyzeFeedbackOutput - The return type for the analyzeFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFeedbackInputSchema = z.object({
  feedbackText: z
    .string()
    .describe('The text content of the user feedback to be analyzed.'),
});

export type AnalyzeFeedbackInput = z.infer<typeof AnalyzeFeedbackInputSchema>;

const AnalyzeFeedbackOutputSchema = z.object({
  sentimentAnalysis: z.object({
    overallSentiment: z
      .enum(['good', 'average', 'bad'])
      .describe('The overall sentiment of the feedback (good, average, or bad).'),
    positiveKeywords: z.array(z.string()).describe('Keywords indicating positive aspects.'),
    negativeKeywords: z.array(z.string()).describe('Keywords indicating negative aspects.'),
    suggestions: z.array(z.string()).describe('Suggestions for improvement derived from feedback.'),
  }),
});

export type AnalyzeFeedbackOutput = z.infer<typeof AnalyzeFeedbackOutputSchema>;

export async function analyzeFeedback(input: AnalyzeFeedbackInput): Promise<AnalyzeFeedbackOutput> {
  return analyzeFeedbackFlow(input);
}

const analyzeFeedbackPrompt = ai.definePrompt({
  name: 'analyzeFeedbackPrompt',
  input: {schema: AnalyzeFeedbackInputSchema},
  output: {schema: AnalyzeFeedbackOutputSchema},
  prompt: `You are an AI assistant specializing in sentiment analysis of user feedback.

  Analyze the following feedback and determine the overall sentiment (good, average, or bad).
  Identify positive and negative keywords, and provide specific suggestions for improvement based on the feedback.

  Feedback: {{{feedbackText}}}

  Format your output as a JSON object conforming to the schema. Pay close attention to categorizing the sentiment accurately and extracting relevant keywords and suggestions.
  `,
});

const analyzeFeedbackFlow = ai.defineFlow(
  {
    name: 'analyzeFeedbackFlow',
    inputSchema: AnalyzeFeedbackInputSchema,
    outputSchema: AnalyzeFeedbackOutputSchema,
  },
  async input => {
    const {output} = await analyzeFeedbackPrompt(input);
    return output!;
  }
);
