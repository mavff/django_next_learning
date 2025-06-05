import Comments from './Comments';

export default function TaskItem({ task, fetchTasks }) {
  const handleToggleDone = async () => {
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
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Deseja realmente excluir esta tarefa?')) {
      const token = localStorage.getItem('access');
      await fetch(`http://localhost:8000/api/tasks/${task.id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(token);
    }
  };

  return (
    <li
      className={`mb-2 p-2 rounded flex flex-col ${
        task.due_date && new Date(task.due_date) < new Date() ? 'bg-red-100' : 'bg-gray-100'
      }`}
    >
      <div className="flex justify-between items-center">
        <span className={task.done ? 'line-through text-gray-400' : ''}>
          {task.name}
        </span>
        <div className="text-xs text-gray-500">
          {task.due_date && `Vence em: ${new Date(task.due_date).toLocaleDateString()}`}
        </div>
        <button
          onClick={handleToggleDone}
          className="ml-2 px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
        >
          {task.done ? 'Desfazer' : 'Concluir'}
        </button>
        <button
          onClick={handleDeleteTask}
          className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Excluir
        </button>
      </div>
      <div className="flex flex-wrap mt-1">
        {task.tags.map(tag => (
          <span
            key={tag.id}
            className="mr-2 mb-1 px-2 py-1 bg-blue-200 rounded text-xs"
          >
            {tag.name}
          </span>
        ))}
      </div>
      <Comments taskId={task.id} />
    </li>
  );
}