import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Tags from './components/Tags';
import TaskItem from './components/TaskItem';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]); // Estado para armazenar as tags
  const [selectedTag, setSelectedTag] = useState(null); // Tag selecionada
  const [selectedTags, setSelectedTags] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controle da sidebar
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      router.push('/login');
    } else {
      fetchTasks(token);
      fetchTags(token);
    }
    // eslint-disable-next-line
  }, []);

  const fetchTasks = async (token) => {
    const res = await fetch('http://localhost:8000/api/tasks/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setTasks(data);
      setError('');
    } else {
      setError('Token inválido ou expirado. Faça login novamente.');
    }
  };

  const fetchTags = async (token) => {
    const res = await fetch('http://localhost:8000/api/tags/', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setTags(data);
      setError('');
    } else {
      setError('Erro ao carregar tags.');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    if (!name.trim()) {
      setError('Digite um título para a tarefa.');
      return;
    }
    const res = await fetch('http://localhost:8000/api/tasks/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, tag_ids: selectedTags.map(Number), due_date: dueDate }),
    });

    if (res.ok) {
      setName('');
      setDueDate('');
      setSelectedTags([]);
      setError('');
      fetchTasks(token);
    } else {
      const errorData = await res.json();
      setError('Erro ao adicionar tarefa: ' + (errorData.detail || JSON.stringify(errorData)));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    router.push('/login');
  };

  const filteredTasks = selectedTag
    ? tasks.filter(task => task.tags.some(tag => tag.id === selectedTag.id))
    : tasks;

  return (
    <div className="flex">
      {/* Sidebar */}
    {isSidebarOpen && (
      <div
        className={`fixed top-0 left-0 h-full bg-gray-100 p-4 shadow-lg z-50 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 md:relative md:translate-x-0`}
      >
        {/* Botão para fechar a sidebar */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="mb-4 p-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Tags</h2>
        <button
          onClick={() => setSelectedTag(null)}
          className={`block w-full text-left px-4 py-2 rounded mb-2 ${
            !selectedTag ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Criar tarefa
        </button>
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => router.push(`/dashboard/${tag.id}`)}
            className={`block w-full text-left px-4 py-2 rounded mb-2 ${
              selectedTag?.id === tag.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    )}

    {/* Overlay para fechar a sidebar */}
    {isSidebarOpen && (
      <div
        onClick={() => setIsSidebarOpen(false)}
        className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
      ></div>
    )}

    {/* Botão para abrir a sidebar (só aparece quando está fechada) */}
    {!isSidebarOpen && (
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="absolute top-4 left-4 p-2 bg-gray-200 rounded hover:bg-gray-300 z-50"
      >
        ☰
      </button>
    )}
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center w-full md:w-3/4 p-6 max-w-xl mx-auto">
        <button
          onClick={() => router.push('/dashboard/dashboard')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
        >
          Ir para Dashboard
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-4"
        >
          Sair
        </button>
        <h1 className="text-3xl font-bold mb-4 text-center">
          {selectedTag ? `Tarefas: ${selectedTag.name}` : 'Minhas Tarefas'}
        </h1>
        {error && (
          <div className="mb-4 p-2 bg-red-200 text-red-800 rounded text-center">
            {error}
          </div>
        )}
        <Tags selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        <form onSubmit={handleAddTask} className="flex flex-col items-center mb-4 w-full">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nova tarefa"
            className="p-2 border border-gray-300 rounded mb-2 w-full"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-2 border border-gray-300 rounded mb-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Adicionar
          </button>
        </form>

        {success && <div className="text-green-600 text-xs mb-1 text-center">{success}</div>}
        {error && <div className="text-red-500 text-xs mb-1 text-center">{error}</div>}

        <ul className="w-full">
          {filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} fetchTasks={fetchTasks} />
          ))}
        </ul>
      </div>
    </div>
  );
}