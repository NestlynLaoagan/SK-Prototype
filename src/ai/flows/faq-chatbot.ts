// This file implements the Genkit flow for the FAQChatbot story.
// It allows users to ask ISKAI, the AI chatbot, questions and receive helpful answers.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FaqChatbotInputSchema = z.object({
  question: z.string().describe('The user question for the FAQ chatbot.'),
});
export type FaqChatbotInput = z.infer<typeof FaqChatbotInputSchema>;

const FaqChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer from the FAQ chatbot.'),
});
export type FaqChatbotOutput = z.infer<typeof FaqChatbotOutputSchema>;

export async function askIskai(input: FaqChatbotInput): Promise<FaqChatbotOutput> {
  return faqChatbotFlow(input);
}

const faqChatbotPrompt = ai.definePrompt({
  name: 'faqChatbotPrompt',
  input: {schema: FaqChatbotInputSchema},
  output: {schema: FaqChatbotOutputSchema},
  prompt: `You are ISKAI, a helpful AI chatbot for Barangay Bakakeng Central.

  Answer the following question about the barangay:

  Question: {{{question}}}

  Keep your answers concise and informative.
`,
});

const faqChatbotFlow = ai.defineFlow(
  {
    name: 'faqChatbotFlow',
    inputSchema: FaqChatbotInputSchema,
    outputSchema: FaqChatbotOutputSchema,
  },
  async input => {
    const {output} = await faqChatbotPrompt(input);
    return output!;
  }
);
