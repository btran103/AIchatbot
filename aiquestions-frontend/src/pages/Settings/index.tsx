import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [enterToSend, setEnterToSend] = useState(true);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [aiModel, setAiModel] = useState('Local Intelligent Engine (Offline)');
  const [temperature, setTemperature] = useState(0.7);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearData = () => {
    if (window.confirm('CẢNH BÁO: Thao tác này sẽ xóa toàn bộ lịch sử chat và bộ nhớ tạm trên trình duyệt! Bạn chắc chắn chứ?')) {
      localStorage.removeItem('aq_local_memories');
      localStorage.removeItem('aq_local_projects');
      localStorage.removeItem('aq_local_tasks');
      alert('Đã xóa dữ liệu cục bộ!');
      window.location.reload();
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>⚙️</span> Cài đặt hệ thống (Settings)
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Tùy chỉnh giao diện, chế độ trò chuyện và các thông số hoạt động của AI.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl text-sm font-medium">
          ✓ Đã áp dụng cài đặt!
        </div>
      )}

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>🎨</span> Giao diện (Appearance)
        </h2>
        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Chế độ hiển thị</p>
            <p className="text-xs text-gray-400">Chuyển đổi giữa giao diện Sáng (Light) và Tối (Dark)</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-sm font-medium text-gray-800 dark:text-gray-200 transition"
          >
            {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      </div>

      {/* Chat Options */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>💬</span> Tùy chọn trò chuyện (Chat)
        </h2>
        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Nhấn Enter để gửi tin nhắn</p>
            <p className="text-xs text-gray-400">Khi tắt, nhấn Ctrl+Enter hoặc nút Gửi</p>
          </div>
          <input
            type="checkbox"
            checked={enterToSend}
            onChange={e => setEnterToSend(e.target.checked)}
            className="w-5 h-5 accent-aq-600 rounded cursor-pointer"
          />
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Hiển thị thời gian gửi (Timestamps)</p>
            <p className="text-xs text-gray-400">Hiển thị mốc giờ bên dưới tin nhắn</p>
          </div>
          <input
            type="checkbox"
            checked={showTimestamps}
            onChange={e => setShowTimestamps(e.target.checked)}
            className="w-5 h-5 accent-aq-600 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* AI Model Config */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>🧠</span> Cấu hình AI Model
        </h2>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Mô hình AI hiện tại</label>
          <select
            value={aiModel}
            onChange={e => setAiModel(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none text-gray-900 dark:text-white"
          >
            <option value="Local Intelligent Engine (Offline)">Local Intelligent Engine (Tự động nội bộ - Miễn phí)</option>
            <option value="Google Gemini Flash (Khuyên dùng - Free)">Google Gemini 1.5 Flash (Thông minh - Có Free Tier)</option>
            <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Cần Anthropic API Key)</option>
          </select>
        </div>
        <div>
          <div className="flex justify-between items-center text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            <span>Độ sáng tạo (Temperature): {temperature}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={e => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-aq-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50/50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900 p-6 shadow-xs">
        <h2 className="text-base font-bold text-red-600 dark:text-red-400 mb-2">Quản lý dữ liệu (Danger Zone)</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Xóa toàn bộ bộ nhớ và các tác vụ đã lưu trữ trên trình duyệt.
        </p>
        <button
          onClick={handleClearData}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition"
        >
          Xóa toàn bộ dữ liệu cục bộ
        </button>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-aq-600 hover:bg-aq-500 rounded-xl shadow-sm transition"
        >
          Lưu tất cả cài đặt
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
