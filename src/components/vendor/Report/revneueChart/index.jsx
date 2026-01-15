import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpot from "@/components/ui/spinner/loadingSpiner";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function RevenueChart({ data = [], heading = "Monthly",height,loading  }) {
  const xKey = heading === "Weekly" ? "day" : "month";

  const formatCurrency = (value) => `$${value}`;

  return (
    <Card className={`shadow-card cursor-default ${height}`}>
      <CardHeader>
        <CardTitle className="font-display">
          {heading} Revenue
        </CardTitle>
      </CardHeader>
      {loading && <LoadingSpot/>}
      <CardContent className="h-[400px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No revenue data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey={xKey}
              />

              <YAxis
                tickFormatter={formatCurrency}
              />

              <Tooltip
                formatter={(value) => formatCurrency(value)}
                labelStyle={{ fontWeight: "600" }}
              />

              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="15%"
                    stopOpacity={0.5}
                    stopColor="var(--primary-color)"
                  />
                  <stop
                    offset="95%"
                    stopOpacity={0}
                    stopColor="var(--primary-color)"
                  />
                </linearGradient>
              </defs>

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary-color)"
                fill="url(#revenueGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
