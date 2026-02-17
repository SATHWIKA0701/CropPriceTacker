import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from '../api/axios';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { Trash2, Edit2, Plus } from 'lucide-react';

export default function ManagePrices() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [prices, setPrices] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [marketsRes, cropsRes] = await Promise.all([
        axios.get('/markets?limit=100'),
        axios.get('/crops?limit=100'),
      ]);
      setMarkets(marketsRes.data.markets || []);
      setCrops(cropsRes.data.crops || []);
      fetchPrices();
    } catch (error) {
      setMessage('Error fetching data');
    }
    setLoading(false);
  };

  const fetchPrices = async () => {
    try {
      const { data } = await axios.get('/price/history/dummy/dummy/30').catch(() => ({
        data: { prices: [] },
      }));
      setPrices(data.prices || []);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const submitData = {
        ...data,
        date: new Date(data.date).toISOString(),
      };

      if (editingId) {
        await axios.put(`/price/${editingId}`, submitData);
        setMessage('Price updated successfully');
        setEditingId(null);
      } else {
        await axios.post('/price', submitData);
        setMessage('Price added successfully');
      }
      reset();
      setShowForm(false);
      fetchPrices();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving price');
    }
  };

  const handleEdit = (price) => {
    const formData = {
      ...price,
      date: new Date(price.date).toISOString().split('T')[0],
    };
    setEditingId(price._id);
    reset(formData);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this price entry?')) {
      try {
        await axios.delete(`/price/${id}`);
        setMessage('Price deleted successfully');
        fetchPrices();
      } catch (error) {
        setMessage('Error deleting price');
      }
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Manage Prices</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                reset();
              }}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus size={20} />
              <span>Add Price</span>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Market</label>
                    <select
                      {...register('marketId', { required: 'Market is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                      <option value="">Select Market</option>
                      {markets.map((market) => (
                        <option key={market._id} value={market._id}>
                          {market.name}
                        </option>
                      ))}
                    </select>
                    {errors.marketId && (
                      <p className="text-red-600 text-sm">{errors.marketId.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
                    <select
                      {...register('cropId', { required: 'Crop is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                      <option value="">Select Crop</option>
                      {crops.map((crop) => (
                        <option key={crop._id} value={crop._id}>
                          {crop.name}
                        </option>
                      ))}
                    </select>
                    {errors.cropId && (
                      <p className="text-red-600 text-sm">{errors.cropId.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      {...register('date', { required: 'Date is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    {errors.date && <p className="text-red-600 text-sm">{errors.date.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('price', {
                        required: 'Price is required',
                        min: { value: 0, message: 'Price must be positive' },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                  >
                    {editingId ? 'Update' : 'Add'} Price
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
                      Market
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Crop
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Price (₹)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((price) => {
                    const market = markets.find((m) => m._id === price.marketId);
                    const crop = crops.find((c) => c._id === price.cropId);
                    return (
                      <tr key={price._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-800">{market?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-gray-800">{crop?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-gray-800">
                          {new Date(price.date).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-gray-800 font-semibold">
                          ₹{parseFloat(price.price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          <button
                            onClick={() => handleEdit(price)}
                            className="inline-flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            <Edit2 size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(price._id)}
                            className="inline-flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
