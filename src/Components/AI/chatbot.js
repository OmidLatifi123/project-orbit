import React, { useState } from 'react';
import axios from 'axios';
import './chatbotStyles.css';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const updatedMessages = [...messages, { role: 'USER', message: input }];
    setMessages(updatedMessages);

    const validMessages = updatedMessages.filter(
      (msg) => msg.role && msg.message && msg.message.trim() !== ''
    );

    try {
      const response = await axios.post(
        'http://localhost:3001/mentalHealth',
        { message: validMessages },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const botResponse = response.data.message;
      setMessages([...updatedMessages, { role: 'CHATBOT', message: botResponse }]);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chatbot space-theme">
      <div className="chatbox">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className="message">
              {message.role === 'CHATBOT' ? (
                <div className="bot-message">{message.message}</div>
              ) : (
                <div className="user-message">{message.message}</div>
              )}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Send a message to space..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
