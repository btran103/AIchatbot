import { useState, useRef, useEffect } from 'react';
import ChatMessage from '../../components/chat/ChatMessage';
import ChatInput from '../../components/chat/ChatInput';

const MODES: Record<string, { label: string; icon: string }> = {
  normal: { label: 'Normal', icon: '💬' },
  study: { label: 'Study', icon: '📚' },
  coding: { label: 'Coding', icon: '💻' },
  english: { label: 'English', icon: '🇬🇧' },
  work: { label: 'Work', icon: '💼' },
  project: { label: 'Project', icon: '📁' },
};

interface LocalMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

const QUICK_PROMPTS: Record<string, string[]> = {
  study: ['Giải thích khái niệm đệ quy', 'Tạo 5 câu hỏi ôn tập về OOP', 'Tóm tắt bài học cho tui'],
  coding: ['Review code này cho tui', 'Debug lỗi này giúp tui', 'Giải thích sự khác nhau giữa useEffect và useLayoutEffect'],
  english: ['Giải thích cách dùng Present Perfect', 'Cho tui 10 từ vựng TOEIC', 'Sửa lỗi ngữ pháp câu này'],
  work: ['Lập kế hoạch tuần này', 'Viết email chuyên nghiệp', 'Phân tích vấn đề này'],
  project: ['Thiết kế database cho app', 'Lên kế hoạch sprint', 'Phân tích yêu cầu dự án'],
  normal: ['Bạn có thể làm gì?', 'Giúp tui lập kế hoạch học tập', 'Giải thích một khái niệm khó'],
};

const ChatPage = ({ mode = 'normal' }: { mode?: string }) => {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentMode(mode);
    setMessages([]);
    setConversationId(null);
  }, [mode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const modeInfo = MODES[currentMode] || MODES.normal;
  const quickPrompts = QUICK_PROMPTS[currentMode] || QUICK_PROMPTS.normal;

  const handleSend = async (content: string) => {
    const userMsg: LocalMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const token = localStorage.getItem('aq_token');
      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('http://localhost:5179/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: content,
          mode: currentMode,
          history,
          conversationId,
        }),
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();

      // Save conversationId for next messages
      if (data.conversationId) setConversationId(data.conversationId);

      const aiMsg: LocalMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || 'Xin lỗi, tui không thể trả lời lúc này.',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errMsg: LocalMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Không thể kết nối đến server. Hãy kiểm tra backend đang chạy và API key đã được cấu hình.',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Mode selector */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto flex-shrink-0">
        {Object.entries(MODES).map(([key, val]) => (
          <button
            key={key}
            onClick={() => { setCurrentMode(key); setMessages([]); setConversationId(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              currentMode === key
                ? 'bg-aq-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-aq-50 dark:hover:bg-aq-950 hover:text-aq-600'
            }`}
          >
            <span>{val.icon}</span>
            <span>{val.label}</span>
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={handleNewChat}
          className="text-xs text-gray-400 hover:text-aq-600 dark:hover:text-aq-400 transition px-2"
        >
          + New
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 pb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-aq-100 to-aq-300 dark:from-aq-900 dark:to-aq-700 flex items-center justify-center text-3xl">
              {modeInfo.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                AIQuestions — {modeInfo.label}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Xin chào! Tui có thể giúp gì cho bạn?
              </p>
            </div>
            <div className="flex flex-col gap-2 max-w-md w-full mt-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:border-aq-300 dark:hover:border-aq-700 hover:text-aq-600 dark:hover:text-aq-400 hover:bg-aq-50 dark:hover:bg-aq-950 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={{ ...msg, id: parseInt(msg.id), conversationId: conversationId ?? 0 }}
          />
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aq-200 to-aq-400 flex items-center justify-center text-aq-900 font-bold text-xs flex-shrink-0 mt-1">
              AQ
            </div>
            <div className="px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-sm shadow-sm">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-aq-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-aq-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-aq-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
                AIQuestions is thinking...
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} loading={loading} />
    </div>
  );
};

export default ChatPage;
