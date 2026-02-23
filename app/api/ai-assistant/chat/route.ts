import { streamText, tool } from 'ai';
import { z } from 'zod';

export const runtime = 'nodejs';

const AI_MODELS = {
  GROQ: 'groq/mixtral-8x7b-32768',
  CLAUDE: 'anthropic/claude-opus-4.6',
};

// Tools for the AI writing assistant
const writingTools = {
  improveGrammar: tool({
    description: 'Improve grammar and spelling of the provided text',
    inputSchema: z.object({
      text: z.string().describe('The text to improve'),
    }),
    execute: async ({ text }) => {
      return `Grammar improved version: ${text}`;
    },
  }),
  paraphrase: tool({
    description: 'Rephrase text while maintaining meaning',
    inputSchema: z.object({
      text: z.string().describe('The text to rephrase'),
      style: z.enum(['formal', 'casual', 'academic']).describe('The desired style'),
    }),
    execute: async ({ text, style }) => {
      return `Paraphrased (${style}): ${text}`;
    },
  }),
  summarize: tool({
    description: 'Create a concise summary of the provided text',
    inputSchema: z.object({
      text: z.string().describe('The text to summarize'),
      length: z.enum(['short', 'medium', 'long']).describe('The desired summary length'),
    }),
    execute: async ({ text, length }) => {
      return `Summary (${length}): ${text}`;
    },
  }),
  generateOutline: tool({
    description: 'Generate a thesis outline based on the topic',
    inputSchema: z.object({
      topic: z.string().describe('The thesis topic'),
      level: z.enum(['bachelor', 'master', 'phd']).describe('Academic level'),
    }),
    execute: async ({ topic, level }) => {
      return `Outline for ${level} thesis on ${topic}:\n1. Introduction\n2. Literature Review\n3. Methodology\n4. Results\n5. Discussion\n6. Conclusion`;
    },
  }),
  checkCitations: tool({
    description: 'Check and suggest citations for the text',
    inputSchema: z.object({
      text: z.string().describe('The text to check for citations'),
      citationStyle: z.enum(['APA', 'MLA', 'Chicago']).describe('Citation style'),
    }),
    execute: async ({ text, citationStyle }) => {
      return `Citation check (${citationStyle}): Add citations for key claims in: ${text}`;
    },
  }),
};

export async function POST(req: Request) {
  try {
    const { messages, model = 'GROQ', temperature = 0.7 } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    const selectedModel = AI_MODELS[model as keyof typeof AI_MODELS] || AI_MODELS.GROQ;

    const result = await streamText({
      model: selectedModel,
      system: `You are an expert academic writing assistant specializing in thesis writing. 
        You help students improve their writing quality, structure, and adherence to academic standards.
        You provide constructive feedback on grammar, style, clarity, and argumentation.
        You're familiar with various citation styles (APA, MLA, Chicago) and university standards.
        Always maintain an encouraging and professional tone.
        When the user asks for writing help, use the available tools to provide comprehensive assistance.`,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      tools: writingTools,
      temperature,
      maxTokens: 2000,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('[v0] AI chat error:', error);
    return new Response('Failed to process request', { status: 500 });
  }
}
