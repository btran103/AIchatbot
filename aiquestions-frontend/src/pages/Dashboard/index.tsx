import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const shortcuts = [
  { icon: '💬', label: 'New Chat', path: '/chat/new', desc: 'Start a conversation' },
  { icon: '📚', label: 'Study', path: '/chat/study', desc: 'Learning assistant' },
  { icon: '💼', label: 'Work', path: '/chat/work', desc: 'Work & planning' },
  { icon: '💻', label: 'Coding', path: '/chat/coding', desc: 'Code & debug' },
  { icon: '🇬🇧', label: 'English', path: '/chat/english', desc: 'English practice' },
  { icon: '📁', label: 'Projects', path: '/projects', desc: 'Manage projects' },
  { icon: '🧠', label: 'Memory', path: '/memory', desc: 'Your AI memory' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">
          Your personal AI assistant for study and work.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {shortcuts.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="group flex flex-col gap-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-aq-300 dark:hover:border-aq-700 hover:shadow-md transition-all duration-200"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-aq-600 dark:group-hover:text-aq-400 transition-colors">
                  {item.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Recent Conversations
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">No conversations yet</p>
          <p className="text-xs text-gray-400 mt-1">Start a new chat to get going!</p>
          <Link
            to="/chat/new"
            className="inline-block mt-4 px-4 py-2 bg-aq-600 hover:bg-aq-500 text-white text-sm font-semibold rounded-xl transition"
          >
            + New Chat
          </Link>
        </div>
      </div>

      {/* Today's Tasks */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Today's Tasks
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">No tasks for today</p>
          <p className="text-xs text-gray-400 mt-1">Create a project to manage your tasks.</p>
          <Link
            to="/projects"
            className="inline-block mt-4 px-4 py-2 border border-aq-300 dark:border-aq-700 text-aq-600 dark:text-aq-400 text-sm font-semibold rounded-xl hover:bg-aq-50 dark:hover:bg-aq-950 transition"
          >
            Go to Projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
