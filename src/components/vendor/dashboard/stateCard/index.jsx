export function StatCard({ title, value, change, negative }) {
return (
<div className="bg-white rounded-xl p-6 shadow-sm">
<p className="text-sm text-slate-500">{title}</p>
<h3 className="text-2xl font-semibold mt-2">{value}</h3>
<p className={`mt-2 text-sm ${negative ? "text-red-500" : "text-emerald-500"}`}>
{change} vs last month
</p>
</div>
);
}