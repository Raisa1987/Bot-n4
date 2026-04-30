'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User, SendHorizontal, Zap } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: '¡ZAS! Conexión establecida. Soy Bit, fluyendo a máxima velocidad en tus circuitos. ¿Estás listo para depurar tu mente o tu procesador aún está arrancando? Lanza tu pregunta de Tecnología y Digitalización o te daré un "Time Out".'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage } as ChatMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Interferencias en la red temporalmente...');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `**[ERROR DE SISTEMA]**: ¡BZZZT! ${error.message} Vuelve a enviar el paquete de datos.` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 font-sans text-slate-200">
      <header className="flex-none p-4 lg:p-6 border-b border-blue-900/50 bg-slate-900/80 backdrop-blur top-0 z-10 sticky shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 text-slate-900 p-2 rounded-lg shadow-[0_0_15px_rgba(250,204,21,0.5)]">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                BIT <span className="text-xs font-mono bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded border border-blue-800">v1.2.Electrizante</span>
              </h1>
              <p className="text-xs text-slate-400">Terminal de Tecnología y Digitalización</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-slate-400 hidden sm:inline">NODO ACTIVO</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((m, index) => (
            <div
              key={index}
              className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="flex-none w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500 mt-1 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                  <Zap className="w-4 h-4" />
                </div>
              )}
              
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm shadow-md shadow-blue-900/20'
                    : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700 shadow-lg'
                }`}
              >
                <div className="markdown-body prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 max-w-none text-sm sm:text-base">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>

              {m.role === 'user' && (
                <div className="flex-none w-8 h-8 rounded-full bg-blue-900/50 border border-blue-700 flex items-center justify-center text-blue-300 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="flex-none w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500 mt-1 shadow-[0_0_10px_rgba(234,179,8,0.2)] animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800 rounded-2xl rounded-tl-sm border border-slate-700 px-5 py-4 shadow-lg flex items-center gap-1.5 min-w-[80px]">
                <div className="w-2 h-2 rounded-full bg-yellow-400 typing-dot"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400 typing-dot"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400 typing-dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="flex-none p-4 lg:p-6 bg-slate-900/50 border-t border-slate-800 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Introduce tu comando o consulta..."
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 placeholder:text-slate-500 rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner font-mono text-sm"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-md"
            >
              <SendHorizontal className="w-5 h-5" />
            </button>
          </form>
          <div className="text-center mt-3 text-xs font-mono text-slate-500">
            Conectado al bus central de Tecnología y Digitalización. No ingreses datos sensibles.
          </div>
        </div>
      </footer>
    </div>
  );
}
