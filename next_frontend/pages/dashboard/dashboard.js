import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      router.push('/login');
    } else {
      fetchTasks(token);
      fetchTags(token);
    }
  }, []);

  const fetchTasks = async (token) => {
    const res = await fetch('http://localhost:8000/api/tasks/', {
      headers: { Authorization: `Bearer ${token}` },
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

  const tasksByTag = (tagId) => {
    return tasks.filter(task => task.tags.some(tag => tag.id === tagId));
  };

  const tasksWithoutTags = () => {
    return tasks.filter(task => task.tags.length === 0);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard de Tarefas</h1>
      {error && (
        <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bloco para tarefas sem tags */}
        <div className="bg-gray-100 p-4 rounded shadow-lg">
          <h2 className="text-xl font-bold mb-4">Sem Tags</h2>
          <ul>
            {tasksWithoutTags().map(task => (
              <li
                key={task.id}
                className={`mb-2 p-2 rounded flex justify-between items-center ${
                  task.due_date && new Date(task.due_date) < new Date() ? 'bg-red-100' : 'bg-gray-200'
                }`}
              >
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
              </li>
            ))}
          </ul>
        </div>

        {/* Blocos para cada tag */}
        {tags.map(tag => (
          <div key={tag.id} className="bg-gray-100 p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">{tag.name}</h2>
            <ul>
              {tasksByTag(tag.id).map(task => (
                <li
                  key={task.id}
                  className={`mb-2 p-2 rounded flex justify-between items-center ${
                    task.due_date && new Date(task.due_date) < new Date() ? 'bg-red-100' : 'bg-gray-200'
                  }`}
                >
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
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}