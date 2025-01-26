import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
  return (
    <div className={`message-container ${isUser ? 'user-message' : 'bot-message'}`}>
      <ReactMarkdown className="prose prose-invert max-w-none">
        {message}
      </ReactMarkdown>
    </div>
  );
};

export default ChatMessage;