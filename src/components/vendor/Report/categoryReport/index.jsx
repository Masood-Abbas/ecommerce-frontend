import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function CategoryReport({ data }) {
  if (!data || data.length === 0) return null;

  // Sort by revenue descending
  const sorted = [...data].sort((a, b) => b.revenue - a.revenue);

  // Top 4 categories
  const topCategories = sorted.slice(0, 4);

  // Remaining categories combined as "Other"
  const otherCategories = sorted.slice(4);
  const other = otherCategories.length
    ? [{
        name: "Other",
        revenue: otherCategories.reduce((acc, c) => acc + c.revenue, 0),
        value: otherCategories.reduce((acc, c) => acc + c.value, 0),
      }]
    : [];

  const chartData = [...topCategories, ...other];

  // Assign colors: top 4 vibrant, "Other" grey
  const colors = ["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#9CA3AF"]; // last grey for Other

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={5}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={colors[i] || "#9CA3AF"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Bars */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {chartData.map((cat, i) => (
            <div key={cat.name}>
              <div className="flex justify-between text-sm font-medium">
                <span>{cat.name}</span>
                <span>${Number(cat.revenue || 0).toLocaleString()}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${cat.value}%`, backgroundColor: colors[i] || "#9CA3AF" }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
