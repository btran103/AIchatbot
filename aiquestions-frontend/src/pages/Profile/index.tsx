import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/common/Logo';

const ProfilePage = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Bảo Trần');
  const [about, setAbout] = useState('Sinh viên ngành Công nghệ phần mềm, đam mê phát triển ứng dụng Fullstack và tích hợp AI.');
  const [goals, setGoals] = useState('Nắm vững .NET & React, thành thạo Docker & CI/CD, đạt TOEIC 750+');
  const [skills, setSkills] = useState('C#, .NET Core, TypeScript, React, SQL Server, Git');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>👤</span> Hồ sơ cá nhân (My Profile)
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Thông tin cá nhân giúp AI Questions đồng bộ và đưa ra các tư vấn phù hợp nhất với ngành học của bạn.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
        {/* Avatar Section */}
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100 dark:border-gray-800 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-aq-500 to-aq-700 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{name}</h2>
            <p className="text-sm text-gray-400">{user?.email || 'user@aiquestions.com'}</p>
            <span className="inline-block mt-1 text-[11px] font-semibold text-aq-600 dark:text-aq-400 bg-aq-50 dark:bg-aq-950 px-2.5 py-0.5 rounded-full border border-aq-200 dark:border-aq-900">
              Công nghệ phần mềm
            </span>
          </div>
        </div>

        {saved && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl text-sm font-medium">
            ✓ Đã lưu thông tin hồ sơ thành công!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-aq-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Giới thiệu bản thân (About)
            </label>
            <textarea
              rows={2}
              value={about}
              onChange={e => setAbout(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-aq-500 text-gray-900 dark:text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Mục tiêu học tập & công việc (Goals)
            </label>
            <textarea
              rows={2}
              value={goals}
              onChange={e => setGoals(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-aq-500 text-gray-900 dark:text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Kỹ năng công nghệ (Skills)
            </label>
            <input
              type="text"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-aq-500 text-gray-900 dark:text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-aq-600 hover:bg-aq-500 rounded-xl shadow-sm transition"
            >
              Cập nhật hồ sơ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
