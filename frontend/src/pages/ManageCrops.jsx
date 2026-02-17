import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from '../api/axios';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { Trash2, Edit2, Plus } from 'lucide-react';

const CATEGORIES = ['Cereals', 'Pulses', 'Oilseeds', 'Spices', 'Vegetables', 'Fruits', 'Other'];

export default function ManageCrops() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/crops?limit=100');
      setCrops(data.crops || []);
    } catch (error) {
      setMessage('Error fetching crops');
    }
    setLoading(false);
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await axios.put(`/crops/${editingId}`, data);
        setMessage('Crop updated successfully');
        setEditingId(null);
      } else {
        await axios.post('/crops', data);
        setMessage('Crop added successfully');
      }
      reset();
      setShowForm(false);
      fetchCrops();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving crop');
    }
  };

  const handleEdit = (crop) => {
    setEditingId(crop._id);
    reset(crop);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await axios.delete(`/crops/${id}`);
        setMessage('Crop deleted successfully');
        fetchCrops();
      } catch (error) {
        setMessage('Error deleting crop');
      }
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Manage Crops</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                reset();
              }}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus size={20} />
              <span>Add Crop</span>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      {...register('name', { required: 'Crop name is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      {...register('category', { required: 'Category is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                      <option value="">Select Category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-600 text-sm">{errors.category.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <input
                      {...register('unit')}
                      defaultValue="kg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                  >
                    {editingId ? 'Update' : 'Add'} Crop
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
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {crops.map((crop) => (
                    <tr key={crop._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-800">{crop.name}</td>
                      <td className="px-6 py-4 text-gray-800">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {crop.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-800">{crop.unit || 'kg'}</td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => handleEdit(crop)}
                          className="inline-flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          <Edit2 size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(crop._id)}
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
