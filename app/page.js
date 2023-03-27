'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { marked } from 'marked';
import parse from 'html-react-parser';

export default function HomePage() {
  const [messages, setMessages] = useState([]);
  const [displayMessage, setDisplayMessage] = useState('Hi there');
  const [loading, setLoading] = useState(false);

  const messageRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();

    const prompt = messageRef.current.value;
    setLoading(true);

    let newMessageList = [
      ...messages,
      {
        role: 'user',
        content: prompt,
      },
    ];

    try {
      const response = await fetch('/api/bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessageList }),
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      newMessageList.push({
        role: data.response.message.role,
        content: data.response.message.content,
      });

      setMessages(newMessageList);
      setDisplayMessage(data.response.message.content);
      messageRef.current.value = '';
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container mx-auto max-w-8xl px-4">
      <div className="grid md:grid-cols-2 items-center grid-col-1 mt-6">
        <div
          className={`bg-gray-800 px-4 flex flex-col justify-center relative whitespace-pre-wrap rounded-lg min-h-[100px] max-w-2xl ${
            loading ? 'animate-pulse' : ''
          }`}
        >
          <div className="absolute h-[15px] w-[15px] bg-gray-800 -right-[7px] top-[50%] rotate-45"></div>
          <h3 className="text-2xl text-white bold">Jarvis says:</h3>
          <p className="text-white">
            {loading ? '[Jarvis is thinking]' : parse(marked(displayMessage))}
          </p>
        </div>
        <div className="order-first mx-auto md:order-last">
          <img
            src="/bot.png"
            alt="chat bot image"
            className="w-20 md:w-[500px]"
          />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="flex flex-col gap-4">
          <label className="font-bold">Say something...</label>
          <input
            className="px-4 bg-transparent py-2 text-gray-100 border border-gray-300 rounded-lg"
            type="text"
            required
            placeholder="Ask a question or say something nice."
            ref={messageRef}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 mt-2 text-gray-100 border border-gray-200 rounded-lg hover:bg-gray-800 hover:text-white transition duration-200"
        >
          Send ✨
        </button>
      </form>
      <div className="mt-6">
        {messages.map((message) => (
          <div key={message.content} className="flex items-center py-2 gap-4">
            <div className="w-[10%] flex items-center">
              {message.role === 'assistant' ? (
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                  <img
                    src="/bot.png"
                    alt="chat bot image"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="text-md font-bold">You:</div>
              )}
            </div>
            <div className="bg-transparent py-2 px-4 border border-gray-400 rounded-xl">
              {message.content}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
