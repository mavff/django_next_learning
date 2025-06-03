import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Comments from './components/Comments';
export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState([]); // NOVO
  const [selectedTags, setSelectedTags] = useState([]); // NOVO
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      router.push('/login');
    } else {
      fetchTasks(token);
      fetchTags(token); // NOVO
    }
    // eslint-disable-next-line
  }, []);

  const fetchTags = async (token) => {
    const res = await fetch('http://localhost:8000/api/tags/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setTags(data);
    }
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    if (!newTag.trim()) return;
    const res = await fetch('http://localhost:8000/api/tags/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newTag }),
    });
    if (res.ok) {
      setNewTag('');
      fetchTags(token);
    }
  };
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
      body: JSON.stringify({name, tag_ids: selectedTags.map(Number) }), // ENVIA tags
    });

    if (res.ok) {
      setName('');
      setSelectedTags([]); // Limpa seleção
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

  return (
    <div className="p-6 max-w-xl mx-auto">
      <button
        onClick={handleLogout}
        className="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Sair
      </button>
      <h1 className="text-3xl font-bold mb-4">Minhas Tarefas</h1>
      {error && (
        <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleAddTag} className="flex mb-2">
        <input
          type="text"
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          placeholder="Nova tag"
          className="flex-1 p-2 border border-gray-300 rounded-l"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600"
        >
          Adicionar Tag
        </button>
      </form>
      <select
        multiple
        value={selectedTags}
        onChange={e => {
          const options = Array.from(e.target.selectedOptions, option => option.value);
          setSelectedTags(options);
        }}
        className="flex-1 p-2 border border-gray-300 rounded mb-2"
      >
        {tags.map(tag => (
          <option key={tag.id} value={tag.id}>{tag.name}</option>
        ))}
      </select>
      <div className="flex flex-wrap mb-2">
        {tags.map(tag => (
          <span key={tag.id} className="mr-2 mb-1 px-2 py-1 bg-blue-200 rounded text-xs flex items-center">
            {tag.name}
            <button
              onClick={async () => {
                if (window.confirm('Excluir esta tag?')) {
                  const token = localStorage.getItem('access');
                  await fetch(`http://localhost:8000/api/tags/${tag.id}/`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  fetchTags(token);
                }
              }}
              className="ml-1 text-red-600 hover:text-red-900"
              title="Excluir tag"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <form onSubmit={handleAddTask} className="flex mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nova tarefa"
          className="flex-1 p-2 border border-gray-300 rounded-l"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Adicionar
        </button>
      </form>
      {success && <div className="text-green-600 text-xs mb-1">{success}</div>}
      {error && <div className="text-red-500 text-xs mb-1">{error}</div>} 
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mb-2 p-2 bg-gray-100 rounded flex flex-col">
            <div className="flex justify-between items-center">
              <span className={task.done ? "line-through text-gray-400" : ""}>
                {task.name}
              </span>
              <button
                onClick={async () => {
                  const token = localStorage.getItem('access');
                  await fetch(`http://localhost:8000/api/tasks/${task.id}/`, {
                    method: 'PATCH',
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ done: !task.done }),
                  });
                  fetchTasks(token);
                }}
                className="ml-2 px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
              >
                {task.done ? "Desfazer" : "Concluir"}
              </button>
              <button
                onClick={async () => {
                  if (window.confirm('Deseja realmente excluir esta tarefa?')) {
                    const token = localStorage.getItem('access');
                    await fetch(`http://localhost:8000/api/tasks/${task.id}/`, {
                      method: 'DELETE',
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    fetchTasks(token);
                  }
                }}
                className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
            <div className="flex flex-wrap mt-1">
              {task.tags.map(tag => (
                <span key={tag.id} className="mr-2 mb-1 px-2 py-1 bg-blue-200 rounded text-xs">{tag.name}</span>
              ))}
            </div>
            <Comments taskId={task.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
