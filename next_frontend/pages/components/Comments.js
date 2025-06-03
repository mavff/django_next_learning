import { useState, useEffect } from 'react';

export default function Comments({ taskId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, []);

  const fetchComments = async () => {
    const token = localStorage.getItem('access');
    const res = await fetch(`http://localhost:8000/api/tasks/${taskId}/comments/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setComments(data);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    const res = await fetch(`http://localhost:8000/api/tasks/${taskId}/comments/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      setText('');
      setError('');
      fetchComments();
    } else {
      setError('Erro ao adicionar comentário.');
    }
  };

  return (
    <div className="mt-2">
      <form onSubmit={handleAddComment} className="flex mb-2">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Novo comentário"
          className="flex-1 p-1 border border-gray-300 rounded-l"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-2 py-1 rounded-r hover:bg-green-600"
        >
          Comentar
        </button>
      </form>
      {error && <div className="text-red-500 text-xs mb-1">{error}</div>}
      <ul>
        {comments.map(comment => (
          <li key={comment.id} className="text-xs bg-gray-200 rounded p-1 mb-1">
            <b>{comment.user}:</b> {comment.text} <span className="text-gray-500">{new Date(comment.created_at).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}