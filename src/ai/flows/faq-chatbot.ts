'use server';
// This file implements the Genkit flow for the FAQChatbot story.
// It allows users to ask ISKAI, the AI chatbot, questions and receive helpful answers.

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (e) {
    console.error('Firebase admin initialization error', e);
  }
}

const db = admin.firestore();

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
  input: {
    schema: z.object({
      question: FaqChatbotInputSchema.shape.question,
      faqContext: z
        .string()
        .describe('A list of questions and answers to use as a knowledge base.'),
    }),
  },
  output: {schema: FaqChatbotOutputSchema},
  prompt: `You are ISKAI, a helpful AI chatbot for Barangay Bakakeng Central.

  Use the following Frequently Asked Questions to answer the user's question.
  If the question is not related to the provided FAQs, politely say that you cannot answer it.

  FAQs:
  {{{faqContext}}}

  ---

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
    // Fetch FAQs from Firestore
    const faqsSnapshot = await db.collection('faqs').get();
    const faqs = faqsSnapshot.docs.map(doc => doc.data());

    // Format FAQs as a string for the prompt
    const faqContext = faqs
      .map(faq => `Q: ${faq.question}\nA: ${faq.answer}`)
      .join('\n\n');

    const {output} = await faqChatbotPrompt({
      question: input.question,
      faqContext: faqContext,
    });
    return output!;
  }
);
