export function StatCard({ title, value, change, negative, icon: Icon, iconBg }) {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white flex items-center gap-4">
      {/* Icon */}
      <div className={`p-2 rounded-lg ${iconBg} flex items-center justify-center`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>

      {/* Text */}
      <div className="flex-1">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
        <p className={`text-sm font-medium ${negative ? "text-red-500" : "text-green-500"}`}>
          {change}
        </p>
      </div>
    </div>
  );
}
