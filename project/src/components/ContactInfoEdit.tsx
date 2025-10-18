import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface ContactInfo {
  id?: number;
  address: string;
  phone: string;
  email: string;
}

const ContactInfoEdit: React.FC = () => {
  const { token } = useAuth();
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<ContactInfo>({
    address: '',
    phone: '',
    email: '',
  });

  const fetchContactInfos = async () => {
    if (!token) {
      setError('Authentication required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/api/contact', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setContactInfos(response.data);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to load contact info');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactInfos();
  }, [token]);

  const resetForm = () => {
    setFormData({ address: '', phone: '', email: '' });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (contact: ContactInfo) => {
    setFormData(contact);
    setEditingId(contact.id || null);
    setShowAddForm(false);
  };

  const handleAdd = () => {
    resetForm();
    setShowAddForm(true);
  };

  const handleSave = async () => {
    if (!token) {
      setError('Authentication required');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingId) {
        // Update existing
        await axios.put(`http://localhost:8080/api/contact/${editingId}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setSuccess('Contact info updated successfully');
      } else {
        // Create new - exclude id to allow auto-generation
        const { id, ...newContactData } = formData;
        await axios.post('http://localhost:8080/api/contact', newContactData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setSuccess('Contact info created successfully');
      }
      resetForm();
      fetchContactInfos();
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError(editingId ? 'Failed to update contact info' : 'Failed to create contact info');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) {
      setError('Authentication required');
      return;
    }
    if (!confirm('Are you sure you want to delete this contact info?')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.delete(`http://localhost:8080/api/contact/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setSuccess('Contact info deleted successfully');
      fetchContactInfos();
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to delete contact info');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Contact Info</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          Add New Contact
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      {/* Contact Info List */}
      <div className="space-y-4 mb-6">
        {contactInfos.length === 0 ? (
          <p className="text-gray-500">No contact info entries found.</p>
        ) : (
          contactInfos.map((contact) => (
            <div key={contact.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="text-sm text-gray-900">{contact.address || 'Not set'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{contact.phone || 'Not set'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{contact.email || 'Not set'}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(contact)}
                  className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => contact.id && handleDelete(contact.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId !== null) && (
        <div className="border rounded-lg p-4 bg-gray-100">
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Contact Info' : 'Add New Contact Info'}</h3>
          <div className="mb-4">
            <label className="block font-medium mb-1" htmlFor="address">Address</label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full border rounded p-2"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1" htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border rounded p-2"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border rounded p-2"
              disabled={loading}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInfoEdit;
