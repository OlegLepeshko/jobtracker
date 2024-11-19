"use client"; 

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Application {
  _id?: string;
  company: string;
  position: string;
  salary_range: string;
  status: string;
  notes: string;
}

const Home: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [form, setForm] = useState<Application>({ company: '', position: '', salary_range: '', status: '', notes: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const response = await axios.get('http://localhost:3001/applications');
    setApplications(response.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editMode) {
      await axios.put(`http://localhost:3001/applications/${editId}`, form);
      setEditMode(false);
      setEditId(null);
    } else {
      await axios.post('http://localhost:3001/applications', form);
    }
    fetchApplications();
    setForm({ company: '', position: '', salary_range: '', status: '', notes: '' });
    setIsModalOpen(false);
  };

  const handleEdit = (application: Application) => {
    setForm(application);
    setEditMode(true);
    setEditId(application._id || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:3001/applications/${id}`);
    fetchApplications();
  };

  return (
    <div>
      <h1>Job Applications Tracker</h1>
      <button onClick={() => setIsModalOpen(true)}>+</button>
      {isModalOpen && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <h2>{editMode ? 'Edit Application' : 'Add New Application'}</h2>
            <input name="company" placeholder="Company" value={form.company} onChange={handleChange} required />
            <input name="position" placeholder="Position" value={form.position} onChange={handleChange} required />
            <input name="salary_range" placeholder="Salary Range" value={form.salary_range} onChange={handleChange} required />
            <input name="status" placeholder="Status" value={form.status} onChange={handleChange} required />
            <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} required />
            <button type="submit">{editMode ? 'Update Application' : 'Add Application'}</button>
            <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
          </form>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Position</th>
            <th>Salary Range</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td>{app.company}</td>
              <td>{app.position}</td>
              <td>{app.salary_range}</td>
              <td>{app.status}</td>
              <td>{app.notes}</td>
              <td>
                <button onClick={() => handleEdit(app)}>Edit</button>
                <button onClick={() => handleDelete(app._id!)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
