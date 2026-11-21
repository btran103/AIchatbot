import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../common/Logo';


const navItems = [
  { icon: '📚', label: 'Study', path: '/chat/study' },
  { icon: '💼', label: 'Work', path: '/chat/work' },
  { icon: '💻', label: 'Coding', path: '/chat/coding' },
  { icon: '🇬🇧', label: 'English', path: '/chat/english' },
  { icon: '📁', label: 'Projects', path: '/projects' },
  { icon: '🧠', label: 'Memory', path: '/memory' },
];

const bottomNav = [
  { icon: '👤', label: 'Profile', path: '/profile' },
  { icon: '⚙️', label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div
      className={`relative flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex-shrink-0 ${
        collapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2.5">
              <Logo size={32} />
              <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">
                AIQuestions
              </span>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition text-sm"
              title="Collapse sidebar"
            >
              ◀
            </button>
          </>
        ) : (
          <div className="mx-auto">
            <Logo size={32} />
          </div>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition text-sm"
          title="Expand sidebar"
        >
          ▶
        </button>
      )}

      {/* New Chat */}
      <div className="p-3">
        <Link
          to="/chat/new"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-aq-600 hover:bg-aq-500 text-white font-semibold text-sm transition shadow-sm ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <span className="text-lg leading-none">+</span>
          {!collapsed && <span>New Chat</span>}
        </Link>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <span className="text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search chats..."
              className="bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none w-full"
            />
          </div>
        </div>
      )}

      {/* Recent Chats */}
      {!collapsed && (
        <div className="px-3 mb-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5">
            Recent
          </p>
          <p className="px-3 py-2 text-xs text-gray-400 italic">No chats yet</p>
        </div>
      )}

      <div className="mx-3 border-t border-gray-200 dark:border-gray-800 my-1" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              collapsed ? 'justify-center' : ''
            } ${
              isActive(item.path)
                ? 'bg-aq-50 dark:bg-aq-950 text-aq-700 dark:text-aq-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
            title={collapsed ? item.label : undefined}
          >
            <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800 space-y-0.5">
        {bottomNav.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? item.label : undefined}
          >
            <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}

        {/* User info */}
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aq-400 to-aq-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-gray-300 hover:text-red-500 transition text-sm"
              title="Logout"
            >
              ↪
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
