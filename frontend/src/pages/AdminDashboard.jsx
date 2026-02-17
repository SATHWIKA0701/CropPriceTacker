import { useEffect, useState } from 'react';
import axios from '../api/axios';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { Package, MapPin, Leaf, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    markets: 0,
    crops: 0,
    prices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [marketsRes, cropsRes, pricesRes] = await Promise.all([
        axios.get('/markets'),
        axios.get('/crops'),
        axios.get('/price/history/dummy/dummy/1').catch(() => ({ data: { prices: [] } })),
      ]);

      setStats({
        markets: marketsRes.data.total || 0,
        crops: cropsRes.data.total || 0,
        prices: pricesRes.data.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4">
      <div className={`${color} p-4 rounded-lg`}>
        <Icon size={32} className="text-white" />
      </div>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome to your admin panel</p>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                icon={MapPin}
                label="Markets"
                value={stats.markets}
                color="bg-blue-600"
              />
              <StatCard
                icon={Leaf}
                label="Crops"
                value={stats.crops}
                color="bg-green-600"
              />
              <StatCard
                icon={DollarSign}
                label="Price Entries"
                value={stats.prices}
                color="bg-orange-600"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/admin/markets"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    → Manage Markets
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/crops"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    → Manage Crops
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/prices"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    → Manage Prices
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Information</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                This admin dashboard allows you to manage crop prices, markets, and crops. You can
                add, edit, and delete entries, as well as view analytics and reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
