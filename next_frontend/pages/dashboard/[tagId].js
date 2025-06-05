import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TaskItem from '../components/TaskItem';

export default function DashboardTag() {
  const router = useRouter();
  const { tagId } = router.query;
  const [tasks, setTasks] = useState([]);
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token || !tagId) return;

    setLoading(true);

    Promise.all([
      fetch(`http://localhost:8000/api/tags/${tagId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.ok ? res.json() : null),
      fetch(`http://localhost:8000/api/tasks/`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.ok ? res.json() : [])
    ]).then(([tagData, tasksData]) => {
      setTag(tagData);
      setTasks(tasksData.filter(task => task.tags.some(t => String(t.id) === String(tagId))));
      setLoading(false);
    });
  }, [tagId]);

  if (loading) return <div className="p-6">Carregando...</div>;
  if (!tag) return <div className="p-6 text-red-600">Tag não encontrada.</div>;

  return (
    <div className="p-6">
      <button
        onClick={() => router.push('/dashboard/dashboard')}
        className="mb-4 bg-gray-300 px-4 py-2 rounded"
      >
        Voltar para Dashboard Geral
      </button>
      <h1 className="text-2xl font-bold mb-4">Dashboard: {tag.name}</h1>
      <ul>
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} fetchTasks={() => {}} />
        ))}
      </ul>
    </div>
  );
}