import { useEffect, useState } from 'react';

export default function Tags({ selectedTags, setSelectedTags }) {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) fetchTags(token);
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

  const handleDeleteTag = async (id) => {
    if (!window.confirm('Excluir esta tag?')) return;
    const token = localStorage.getItem('access');
    await fetch(`http://localhost:8000/api/tags/${id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTags(token);
  };

  return (
    <>
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
        className="flex-1 p-2 border border-gray-300 rounded mb-2 w-full"
      >
        {tags.map(tag => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>

      <div className="flex flex-wrap mb-2">
        {tags.map(tag => (
          <span key={tag.id} className="mr-2 mb-1 px-2 py-1 bg-blue-200 rounded text-xs flex items-center">
            {tag.name}
            <button
              onClick={() => handleDeleteTag(tag.id)}
              className="ml-1 text-red-600 hover:text-red-900"
              title="Excluir tag"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </>
  );
}
