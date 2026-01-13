export function StatCard({ title, value, icon: Icon, iconBg }) {
  return (
    <div className="p-4 border rounded-lg hover:shadow-sm bg-white flex items-center gap-4 cursor-pointer">
      {/* Icon */}
      <div className={`p-2 rounded-lg ${iconBg} flex items-center justify-center`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>

      {/* Text */}
      <div className="flex-1">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
