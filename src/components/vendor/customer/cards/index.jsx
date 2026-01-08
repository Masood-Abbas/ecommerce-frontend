export function CustomerSummaryCard({ title, value, icon: Icon, iconBg = "bg-gray-100" }) {
  return (
    <div className="p-5 rounded-xl border bg-gray-50 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Icon on the left */}
      {Icon && (
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className="h-6 w-6" />
        </div>
      )}

      {/* Text */}
      <div className="flex flex-col">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
}
