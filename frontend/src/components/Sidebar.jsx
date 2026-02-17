import { Link } from 'react-router-dom';
import { BarChart3, MapPin, Leaf, DollarSign } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: BarChart3 },
    { label: 'Markets', path: '/admin/markets', icon: MapPin },
    { label: 'Crops', path: '/admin/crops', icon: Leaf },
    { label: 'Prices', path: '/admin/prices', icon: DollarSign },
  ];

  return (
    <aside className="bg-gray-100 w-64 min-h-screen border-r border-gray-300">
      <div className="p-6 space-y-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-100 transition text-gray-700 hover:text-green-700"
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
