import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { Memory } from '../../types';

const MemoryPage = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', content: '' });

  // Mock initial memories nếu chưa có DB sync
  useEffect(() => {
    const saved = localStorage.getItem('aq_local_memories');
    if (saved) {
      setMemories(JSON.parse(saved));
    } else {
      const init: Memory[] = [
        { id: 1, title: 'Ngành học', content: 'Sinh viên chuyên ngành Công nghệ phần mềm, định hướng Fullstack Web (.NET + React).', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 2, title: 'Phong cách học tập', content: 'Thích giải thích bản chất vấn đề, đi kèm code ví dụ thực tế và chỉ gợi ý hướng giải quyết bài tập.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 3, title: 'Mục tiêu cá nhân', content: 'Xây dựng hoàn thiện dự án AIQuestions và luyện thi chứng chỉ TOEIC.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ];
      setMemories(init);
      localStorage.setItem('aq_local_memories', JSON.stringify(init));
    }
  }, []);

  const saveToStorage = (items: Memory[]) => {
    setMemories(items);
    localStorage.setItem('aq_local_memories', JSON.stringify(items));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ title: '', content: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (m: Memory) => {
    setEditingId(m.id);
    setForm({ title: m.title, content: m.content });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa ký ức này?')) {
      const updated = memories.filter(m => m.id !== id);
      saveToStorage(updated);
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('Bạn có chắc muốn xóa TẤT CẢ ký ức không?')) {
      saveToStorage([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    if (editingId) {
      const updated = memories.map(m =>
        m.id === editingId
          ? { ...m, title: form.title, content: form.content, updatedAt: new Date().toISOString() }
          : m
      );
      saveToStorage(updated);
    } else {
      const newMem: Memory = {
        id: Date.now(),
        title: form.title,
        content: form.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      saveToStorage([newMem, ...memories]);
    }
    setShowModal(false);
  };

  const filtered = memories.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🧠</span> My Memory (Ký ức AI)
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Lưu trữ thông tin cá nhân, mục tiêu và thói quen để AI ghi nhớ và phục vụ bạn chính xác nhất.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {memories.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="px-3.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-800 transition"
            >
              Xóa tất cả
            </button>
          )}
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 text-sm font-semibold text-white bg-aq-600 hover:bg-aq-500 rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <span>+</span> Thêm ký ức
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 focus-within:border-aq-400 transition">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm ký ức (theo tiêu đề, nội dung)..."
            className="w-full bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-xs text-gray-400 hover:text-gray-600">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Memory Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <p className="text-4xl mb-3">🧠</p>
          <p className="text-base font-semibold text-gray-900 dark:text-white">Không tìm thấy ký ức nào</p>
          <p className="text-xs text-gray-400 mt-1">Hãy tạo ký ức đầu tiên để AI ghi nhớ thông tin về bạn!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(m => (
            <div
              key={m.id}
              className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-aq-300 dark:hover:border-aq-700 shadow-sm flex flex-col justify-between transition group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base group-hover:text-aq-600 dark:group-hover:text-aq-400 transition">
                    {m.title}
                  </h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleOpenEdit(m)}
                      className="p-1 text-xs text-gray-400 hover:text-aq-600"
                      title="Sửa"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-1 text-xs text-gray-400 hover:text-red-500"
                      title="Xóa"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {m.content}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400 flex justify-between items-center">
                <span>Cập nhật: {new Date(m.updatedAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-800 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {editingId ? 'Chỉnh sửa ký ức' : 'Thêm ký ức mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Tiêu đề (Chủ đề)
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Ví dụ: Mục tiêu công việc, Dự án đang làm..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:border-aq-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Nội dung chi tiết
                </label>
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Nhập thông tin bạn muốn AI luôn nhớ và áp dụng khi trả lời..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:border-aq-500 resize-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-aq-600 hover:bg-aq-500 rounded-xl shadow-sm"
                >
                  Lưu ký ức
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryPage;
