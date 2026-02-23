'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WritingAssistantProps {
  documentId?: string;
  selectedText?: string;
}

export function WritingAssistant({ documentId, selectedText }: WritingAssistantProps) {
  const [model, setModel] = useState<'GROQ' | 'CLAUDE'>('GROQ');
  const [temperature, setTemperature] = useState(0.7);

  const { messages, input, setInput, append, isLoading, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/ai-assistant/chat',
      prepareSendMessagesRequest: ({ messages }) => ({
        body: {
          messages,
          model,
          temperature,
          documentId,
        },
      }),
    }),
    initialMessages: selectedText
      ? [
          {
            id: '1',
            role: 'user',
            parts: [
              {
                type: 'text',
                text: `Please review and improve this text:\n\n"${selectedText}"`,
              },
            ],
          },
        ]
      : [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    append({
      role: 'user',
      content: input,
    });
    setInput('');
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>AI Writing Assistant</span>
          <div className="flex gap-4 text-sm">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as 'GROQ' | 'CLAUDE')}
              className="px-2 py-1 bg-background border border-border rounded"
            >
              <option value="GROQ">Groq (Fast)</option>
              <option value="CLAUDE">Claude (Advanced)</option>
            </select>
            <div>
              <label className="text-xs text-muted-foreground">Temperature: {temperature.toFixed(1)}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-24"
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1 overflow-hidden">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Start a conversation with the AI writing assistant</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-foreground border border-border'
                  }`}
                >
                  {message.parts?.map((part, idx) => (
                    <div key={idx}>
                      {part.type === 'text' && <p>{part.text}</p>}
                      {part.type === 'tool-call' && (
                        <p className="text-xs italic">Tool: {part.toolName}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
          {isLoading && status === 'streaming' && (
            <div className="flex justify-start">
              <div className="bg-card border border-border px-3 py-2 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for writing help..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
