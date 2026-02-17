import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from '../api/axios';
import PriceChart from '../components/PriceChart';
import Loader, { SkeletonLoader } from '../components/Loader';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function Home() {
  const { register, handleSubmit, watch } = useForm();
  const [markets, setMarkets] = useState([]);
  const [crops, setCrops] = useState([]);
  const [priceData, setPriceData] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const selectedMarket = watch('market');
  const selectedCrop = watch('crop');
  const selectedDays = watch('days') || '7';

  useEffect(() => {
    fetchMarkets();
    fetchCrops();
  }, []);

  useEffect(() => {
    if (selectedMarket && selectedCrop) {
      fetchPriceData();
    }
  }, [selectedMarket, selectedCrop, selectedDays]);

  const fetchMarkets = async () => {
    try {
      const { data } = await axios.get('/markets?limit=100');
      setMarkets(data.markets || []);
    } catch (error) {
      console.error('Error fetching markets:', error);
    }
  };

  const fetchCrops = async () => {
    try {
      const { data } = await axios.get('/crops?limit=100');
      setCrops(data.crops || []);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  const fetchPriceData = async () => {
    setLoading(true);
    try {
      const [todayRes, historyRes] = await Promise.all([
        axios.get(`/price/today/${selectedMarket}/${selectedCrop}`).catch(() => null),
        axios.get(`/price/history/${selectedMarket}/${selectedCrop}/${selectedDays}`),
      ]);

      if (todayRes?.data) {
        setPriceData(todayRes.data.price);
      }

      if (historyRes?.data) {
        setPriceHistory(historyRes.data.prices || []);

        const prices = historyRes.data.prices.map((p) => p.price);
        setStats({
          avg: (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2),
          min: Math.min(...prices).toFixed(2),
          max: Math.max(...prices).toFixed(2),
          latest: prices[prices.length - 1]?.toFixed(2),
        });
      }
    } catch (error) {
      console.error('Error fetching price data:', error);
    }
    setLoading(false);
  };

  const getTrendIcon = () => {
    if (!stats || !priceData) return null;
    const change = parseFloat(priceData.price) - parseFloat(stats.latest);
    if (change > 0) {
      return <TrendingUp className="text-green-600" size={24} />;
    } else if (change < 0) {
      return <TrendingDown className="text-red-600" size={24} />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">CropPrice Tracker</h1>
          <p className="text-gray-600">Track agricultural crop prices in real-time</p>
        </div>

        <form className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Market
              </label>
              <select
                {...register('market')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Choose Market</option>
                {markets.map((market) => (
                  <option key={market._id} value={market._id}>
                    {market.name} ({market.district})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Crop
              </label>
              <select
                {...register('crop')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Choose Crop</option>
                {crops.map((crop) => (
                  <option key={crop._id} value={crop._id}>
                    {crop.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period
              </label>
              <select
                {...register('days')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
              </select>
            </div>
          </div>
        </form>

        {selectedMarket && selectedCrop ? (
          <div className="space-y-6">
            {loading ? (
              <SkeletonLoader />
            ) : priceData ? (
              <>
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-lg mb-2">Current Price</p>
                      <p className="text-5xl font-bold text-green-700">
                        ₹{parseFloat(priceData.price).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Updated: {new Date(priceData.date).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="text-center">
                      {getTrendIcon()}
                      {stats && (
                        <p className="text-2xl font-bold text-gray-700 mt-2">
                          ₹{parseFloat(stats.avg).toFixed(2)}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">Average</p>
                    </div>
                  </div>
                </div>

                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                      <p className="text-gray-600 text-sm mb-2">Minimum</p>
                      <p className="text-3xl font-bold text-gray-800">₹{stats.min}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                      <p className="text-gray-600 text-sm mb-2">Maximum</p>
                      <p className="text-3xl font-bold text-gray-800">₹{stats.max}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                      <p className="text-gray-600 text-sm mb-2">Average</p>
                      <p className="text-3xl font-bold text-gray-800">₹{stats.avg}</p>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Price Trend</h2>
                  <PriceChart data={priceHistory} type="area" />
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-600">No price data available for this selection</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">Select a market and crop to view price data</p>
          </div>
        )}
      </div>
    </div>
  );
}
