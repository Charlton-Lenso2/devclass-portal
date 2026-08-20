import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getActivityById, createActivity, updateActivity } from '../api/activities';
import api from '../api/axios';

export default function ActivityForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'ASSIGNMENT',
    priority: 0,
    startDate: '',
    dueDate: '',
    location: '',
    categoryId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    async function load() {
      try {
        const res = await getActivityById(id);
        const a = res.data;
        setForm({
          title: a.title || '',
          description: a.description || '',
          type: a.type || 'ASSIGNMENT',
          priority: a.priority ?? 0,
          startDate: a.startDate ? a.startDate.slice(0, 16) : '',
          dueDate: a.dueDate ? a.dueDate.slice(0, 16) : '',
          location: a.location || '',
          categoryId: a.categoryId || '',
        });
      } catch (err) {
        setError('Failed to load activity');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isEditing]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.title || !form.type) {
      setError('Title and type are required');
      return;
    }

    try {
      if (isEditing) {
        await updateActivity(id, form);
      } else {
        await createActivity(form);
      }
      navigate('/activities');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save activity');
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <Link to="/activities" className="detail-back">&larr; Back to Activities</Link>
      <h1>{isEditing ? 'Edit Activity' : 'New Activity'}</h1>

      <form onSubmit={handleSubmit} className="form-stack">
        <label>
          Title *
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
        </label>

        <label>
          Type *
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="ASSIGNMENT">Assignment</option>
            <option value="EXERCISE">Exercise</option>
            <option value="PROJECT">Project</option>
            <option value="EVENT">Event</option>
          </select>
        </label>

        <label>
          Category
          <select name="categoryId" value={form.categoryId} onChange={handleChange}>
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label>
          Priority
          <input type="number" name="priority" value={form.priority} onChange={handleChange} min={0} max={5} />
        </label>

        <label>
          Location
          <input name="location" value={form.location} onChange={handleChange} />
        </label>

        <label>
          Start Date
          <input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} />
        </label>

        <label>
          Due Date
          <input type="datetime-local" name="dueDate" value={form.dueDate} onChange={handleChange} />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn-primary">{isEditing ? 'Save Changes' : 'Create Activity'}</button>
      </form>
    </div>
  );
}