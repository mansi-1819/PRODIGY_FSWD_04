import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const Chat = ({ token }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('general');
  const socket = io('http://localhost:5000');

  useEffect(() => {
    socket.emit('joinRoom', room);

    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.emit('leaveRoom', room);
      socket.off();
    };
  }, [room]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get(`http://localhost:5000/api/chat/${room}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    };

    fetchMessages();
  }, [room, token]);

  const sendMessage = (e) => {
    e.preventDefault();
    const msg = { room, sender: 'User', content: message };
    socket.emit('sendMessage', msg);
    setMessage('');
  };

  return (
    <div>
      <div>
        <h2>Room: {room}</h2>
        <button onClick={() => setRoom('general')}>General</button>
        <button onClick={() => setRoom('random')}>Random</button>
      </div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
