import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpot from "@/components/ui/spinner/loadingSpiner";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CategoryReport({
  data,
  show,
  className,
  loading,
  para,
}) {
  if (!data || data.length === 0) return null;
  const sorted = [...data].sort((a, b) => b.revenue - a.revenue);
  const topCategories = sorted.slice(0, 4);
  const otherCategories = sorted.slice(4);
  const other = otherCategories.length
    ? [
        {
          name: "Other",
          revenue: otherCategories.reduce((acc, c) => acc + c.revenue, 0),
          value: otherCategories.reduce((acc, c) => acc + c.value, 0),
        },
      ]
    : [];

  const chartData = [...topCategories, ...other];

  const colors = ["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#9CA3AF"];

  return (
    <div
      className={`grid grid-cols-1 lg:${
        className || "grid-cols-2"
      } gap-6 cursor-default `}
    >
      {/* Pie Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
          {para && <p className="text-sm text-muted-foreground">{para}</p>}
        </CardHeader>
        {loading && <LoadingSpot />}
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No revenue data available
          </div>
        ) : (
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={colors[i] || "#9CA3AF"} />
                  ))}
                </Pie>
                <Tooltip />
                {show === "false" ? "" : <Legend />}
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        )}
      </Card>

      {/* Revenue Bars */}
      {show === "false" ? (
        ""
      ) : (
        <Card className="shadow-card cursor-default">
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No revenue data available
            </div>
          ) : (
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
                      style={{
                        width: `${cat.value}%`,
                        backgroundColor: colors[i] || "#9CA3AF",
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
