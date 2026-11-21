import { useState, useEffect } from 'react';
import type { Project, TaskItem } from '../../types';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [projectFiles, setProjectFiles] = useState<string[]>([]);

  // Modal controls
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: '', description: '', technology: '', status: 'In Progress' });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'Medium' });

  // Chọn thư mục từ máy tính thông qua HTML5 Folder Picker
  const handleOpenLocalFolder = async () => {
    try {
      // @ts-ignore: File System Access API
      if (window.showDirectoryPicker) {
        // @ts-ignore
        const dirHandle = await window.showDirectoryPicker();
        const folderName = dirHandle.name;
        const detectedFiles: string[] = [];
        let detectedTech = 'Chưa xác định';

        // Quét các file tầng 1
        // @ts-ignore
        for await (const entry of dirHandle.values()) {
          detectedFiles.push(entry.name);
          if (entry.name.endsWith('.csproj') || entry.name.endsWith('.sln')) detectedTech = 'C# / .NET Core';
          if (entry.name === 'package.json') detectedTech = 'JavaScript / TypeScript / Node.js';
          if (entry.name === 'requirements.txt' || entry.name.endsWith('.py')) detectedTech = 'Python';
          if (entry.name === 'pom.xml') detectedTech = 'Java / Spring';
        }

        setProjectFiles(detectedFiles);

        const newP: Project = {
          id: Date.now(),
          name: folderName,
          description: `Dự án liên kết trực tiếp từ thư mục trên máy: ${folderName}`,
          technology: detectedTech,
          status: 'In Progress',
          notes: `Chứa ${detectedFiles.length} tệp/thư mục gốc: ${detectedFiles.slice(0, 5).join(', ')}...`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const updated = [newP, ...projects];
        saveProjects(updated);
        setActiveProjectId(newP.id);
      } else {
        alert('Trình duyệt của bạn không hỗ trợ tính năng chọn trực tiếp thư mục (cần Chrome/Edge/Brave).');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const savedProjects = localStorage.getItem('aq_local_projects');
    const savedTasks = localStorage.getItem('aq_local_tasks');

    if (savedProjects) {
      const p = JSON.parse(savedProjects);
      setProjects(p);
      if (p.length > 0) setActiveProjectId(p[0].id);
    } else {
      const initProjects: Project[] = [
        {
          id: 1,
          name: 'AIQuestions (AQ)',
          description: 'Hệ thống trợ lý AI cá nhân hỗ trợ chuyên sâu cho Học tập và Công việc.',
          technology: 'React + TypeScript + Vite + Tailwind CSS + ASP.NET Core + SQL Server',
          status: 'In Progress',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Health Booking System',
          description: 'Nền tảng đặt lịch khám bệnh trực tuyến cho bệnh nhân và bác sĩ.',
          technology: 'C#, ASP.NET Core, EF Core, SQL Server',
          status: 'Planning',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setProjects(initProjects);
      setActiveProjectId(1);
      localStorage.setItem('aq_local_projects', JSON.stringify(initProjects));
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const initTasks: TaskItem[] = [
        { id: 1, projectId: 1, title: 'Thiết kế nhận diện thương hiệu tím trắng', status: 'Done', priority: 'High', createdAt: new Date().toISOString() },
        { id: 2, projectId: 1, title: 'Xây dựng Backend Auth & JWT', status: 'Done', priority: 'High', createdAt: new Date().toISOString() },
        { id: 3, projectId: 1, title: 'Hoàn thiện giao diện Chat AI & Modes', status: 'In Progress', priority: 'High', createdAt: new Date().toISOString() },
        { id: 4, projectId: 1, title: 'Tích hợp module Quản lý Ký ức & Task', status: 'Todo', priority: 'Medium', createdAt: new Date().toISOString() },
        { id: 5, projectId: 2, title: 'Lên sơ đồ thực thể kết hợp (ERD)', status: 'Todo', priority: 'High', createdAt: new Date().toISOString() }
      ];
      setTasks(initTasks);
      localStorage.setItem('aq_local_tasks', JSON.stringify(initTasks));
    }
  }, []);

  const saveProjects = (items: Project[]) => {
    setProjects(items);
    localStorage.setItem('aq_local_projects', JSON.stringify(items));
  };

  const saveTasks = (items: TaskItem[]) => {
    setTasks(items);
    localStorage.setItem('aq_local_tasks', JSON.stringify(items));
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name.trim()) return;

    const newP: Project = {
      id: Date.now(),
      name: projectForm.name,
      description: projectForm.description,
      technology: projectForm.technology,
      status: projectForm.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newP, ...projects];
    saveProjects(updated);
    setActiveProjectId(newP.id);
    setShowProjectModal(false);
    setProjectForm({ name: '', description: '', technology: '', status: 'In Progress' });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim() || !activeProjectId) return;

    const newT: TaskItem = {
      id: Date.now(),
      projectId: activeProjectId,
      title: taskForm.title,
      description: taskForm.description,
      status: 'Todo',
      priority: taskForm.priority,
      createdAt: new Date().toISOString()
    };

    saveTasks([newT, ...tasks]);
    setShowTaskModal(false);
    setTaskForm({ title: '', description: '', priority: 'Medium' });
  };

  const handleUpdateTaskStatus = (taskId: number, newStatus: string) => {
    const updated = tasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t));
    saveTasks(updated);
  };

  const handleDeleteTask = (taskId: number) => {
    saveTasks(tasks.filter(t => t.id !== taskId));
  };

  const activeProject = projects.find(p => p.id === activeProjectId);
  const currentTasks = tasks.filter(t => t.projectId === activeProjectId);

  const todoTasks = currentTasks.filter(t => t.status === 'Todo');
  const inProgressTasks = currentTasks.filter(t => t.status === 'In Progress');
  const doneTasks = currentTasks.filter(t => t.status === 'Done');

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📁</span> Projects & Tasks
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Theo dõi tiến độ, quản lý công việc và kế hoạch học tập theo từng dự án.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenLocalFolder}
            className="px-4 py-2 text-sm font-semibold text-aq-700 dark:text-aq-300 bg-aq-50 dark:bg-aq-950/60 hover:bg-aq-100 dark:hover:bg-aq-900 border border-aq-200 dark:border-aq-800 rounded-xl shadow-xs transition flex items-center gap-1.5"
            title="Mở thư mục source code bất kỳ trên máy tính của bạn"
          >
            <span>📂</span> Mở thư mục từ máy tính
          </button>
          <button
            onClick={() => setShowProjectModal(true)}
            className="px-4 py-2 text-sm font-semibold text-white bg-aq-600 hover:bg-aq-500 rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <span>+</span> Tạo dự án mới
          </button>
        </div>
      </div>

      {/* Project Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-gray-200 dark:border-gray-800">
        {projects.map(p => (
          <button
            key={p.id}
            onClick={() => setActiveProjectId(p.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              activeProjectId === p.id
                ? 'bg-aq-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
            }`}
          >
            <span>📁</span>
            <span>{p.name}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeProjectId === p.id ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
            }`}>
              {tasks.filter(t => t.projectId === p.id).length}
            </span>
          </button>
        ))}
      </div>

      {activeProject ? (
        <div>
          {/* Active Project Info */}
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 mb-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeProject.name}</h2>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-aq-50 dark:bg-aq-950 text-aq-600 dark:text-aq-400 border border-aq-200 dark:border-aq-800">
                    {activeProject.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{activeProject.description}</p>
                {activeProject.technology && (
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                    <span>⚡ Công nghệ:</span>
                    <span className="font-mono text-aq-600 dark:text-aq-400 font-semibold">{activeProject.technology}</span>
                  </p>
                )}
                {activeProject.notes && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200/60 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300">
                    <span>📁 Tệp tin phát hiện: </span>
                    <span className="font-mono text-gray-800 dark:text-gray-200">{activeProject.notes}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowTaskModal(true)}
                className="px-4 py-2 text-sm font-semibold text-white bg-aq-600 hover:bg-aq-500 rounded-xl shadow-sm transition whitespace-nowrap self-start"
              >
                + Thêm Task
              </button>
            </div>
          </div>

          {/* Kanban Board columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Todo */}
            <div className="bg-gray-100/60 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  📋 Cần làm ({todoTasks.length})
                </span>
              </div>
              <div className="space-y-3">
                {todoTasks.map(t => renderTaskCard(t))}
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="bg-gray-100/60 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold text-aq-600 dark:text-aq-400 uppercase tracking-wider">
                  ⏳ Đang thực hiện ({inProgressTasks.length})
                </span>
              </div>
              <div className="space-y-3">
                {inProgressTasks.map(t => renderTaskCard(t))}
              </div>
            </div>

            {/* Column 3: Done */}
            <div className="bg-gray-100/60 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
                  ✅ Đã hoàn thành ({doneTasks.length})
                </span>
              </div>
              <div className="space-y-3">
                {doneTasks.map(t => renderTaskCard(t))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <p className="text-4xl mb-3">📁</p>
          <p className="text-base font-semibold text-gray-900 dark:text-white">Chưa có dự án nào</p>
          <button
            onClick={() => setShowProjectModal(true)}
            className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-aq-600 hover:bg-aq-500 rounded-xl"
          >
            Tạo dự án đầu tiên
          </button>
        </div>
      )}

      {/* Modal Add Project */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-800 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tạo Dự Án Mới</h2>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tên dự án</label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
                  placeholder="Ví dụ: App Ôn Thi TOEIC, AI Assistant..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-aq-500 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Mô tả dự án</label>
                <textarea
                  value={projectForm.description}
                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Mô tả mục tiêu của dự án..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-aq-500 text-gray-900 dark:text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Công nghệ sử dụng</label>
                <input
                  type="text"
                  value={projectForm.technology}
                  onChange={e => setProjectForm({ ...projectForm, technology: e.target.value })}
                  placeholder="React, .NET, SQL Server..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-aq-500 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-aq-600 hover:bg-aq-500 rounded-xl shadow-sm"
                >
                  Tạo dự án
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Task */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-800 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Thêm Task Mới</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tiêu đề task</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Viết mã xử lý, làm bài tập..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-aq-500 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Mức độ ưu tiên</label>
                <select
                  value={taskForm.priority}
                  onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-aq-500 text-gray-900 dark:text-white"
                >
                  <option value="Low">Thấp (Low)</option>
                  <option value="Medium">Trung bình (Medium)</option>
                  <option value="High">Cao (High)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-aq-600 hover:bg-aq-500 rounded-xl shadow-sm"
                >
                  Thêm Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  function renderTaskCard(task: TaskItem) {
    const priorityColor =
      task.priority === 'High'
        ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900'
        : task.priority === 'Medium'
        ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900'
        : 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900';

    return (
      <div
        key={task.id}
        className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs hover:border-aq-300 dark:hover:border-aq-700 transition"
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug">{task.title}</p>
          <button
            onClick={() => handleDeleteTask(task.id)}
            className="text-gray-300 hover:text-red-500 text-xs"
            title="Xóa"
          >
            ✕
          </button>
        </div>
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${priorityColor}`}>
            {task.priority}
          </span>
          <select
            value={task.status}
            onChange={e => handleUpdateTaskStatus(task.id, e.target.value)}
            className="text-[11px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 outline-none text-gray-700 dark:text-gray-300"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>
    );
  }
};

export default ProjectsPage;
