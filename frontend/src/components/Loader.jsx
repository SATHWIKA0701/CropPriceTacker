export default function Loader() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-700"></div>
    </div>
  );
}

export function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-200 h-12 rounded-lg animate-pulse"></div>
      ))}
    </div>
  );
}
