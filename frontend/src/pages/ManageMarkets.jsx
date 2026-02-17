import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from '../api/axios';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { Trash2, Edit2, Plus } from 'lucide-react';

export default function ManageMarkets() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/markets?limit=100');
      setMarkets(data.markets || []);
    } catch (error) {
      setMessage('Error fetching markets');
    }
    setLoading(false);
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await axios.put(`/markets/${editingId}`, data);
        setMessage('Market updated successfully');
        setEditingId(null);
      } else {
        await axios.post('/markets', data);
        setMessage('Market added successfully');
      }
      reset();
      setShowForm(false);
      fetchMarkets();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving market');
    }
  };

  const handleEdit = (market) => {
    setEditingId(market._id);
    reset(market);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this market?')) {
      try {
        await axios.delete(`/markets/${id}`);
        setMessage('Market deleted successfully');
        fetchMarkets();
      } catch (error) {
        setMessage('Error deleting market');
      }
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Manage Markets</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                reset();
              }}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus size={20} />
              <span>Add Market</span>
            </button>
          </div>

          {message && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
              {message}
            </div>
          )}

          {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      {...register('state', { required: 'State is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    {errors.state && <p className="text-red-600 text-sm">{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <input
                      {...register('district', { required: 'District is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    {errors.district && (
                      <p className="text-red-600 text-sm">{errors.district.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mandal</label>
                    <input
                      {...register('mandal')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                  >
                    {editingId ? 'Update' : 'Add'} Market
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      reset();
                    }}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <Loader />
          ) : (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      State
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      District
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Mandal
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {markets.map((market) => (
                    <tr key={market._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-800">{market.name}</td>
                      <td className="px-6 py-4 text-gray-800">{market.state}</td>
                      <td className="px-6 py-4 text-gray-800">{market.district}</td>
                      <td className="px-6 py-4 text-gray-800">{market.mandal || '-'}</td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => handleEdit(market)}
                          className="inline-flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          <Edit2 size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(market._id)}
                          className="inline-flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
