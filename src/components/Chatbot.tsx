import React, { useState, useRef, useEffect } from 'react';
import { Groq } from 'groq-sdk';
import { useToast } from "@/components/ui/use-toast";
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface Message {
  content: string;
  isUser: boolean;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const groq = new Groq({
    apiKey: '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'
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { content: message, isUser: true }]);

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: message }],
        model: 'llama-3.3-70b-versatile',
      });

      const botResponse = completion.choices[0]?.message?.content || 'Sorry, I could not process your request.';
      setMessages(prev => [...prev, { content: botResponse, isUser: false }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from the chatbot. Please try again.",
        variant: "destructive"
      });
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-gray-900 to-purple-900 p-4 rounded-lg">
        <span className="gradient-text">hack2skill chatbot</span>
      </h1>
      
      <div className="flex-1 overflow-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.content}
            isUser={message.isUser}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default Chatbot;