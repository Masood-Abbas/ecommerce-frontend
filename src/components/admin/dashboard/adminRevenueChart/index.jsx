import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpot from "@/components/ui/spinner/loadingSpiner";
import { formatCurrency } from "@/utils/currencyFormating";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function RevenueChart({
  data = [],
  heading = "Weekly",
  height,
  loading,
}) {
  const xKey = heading === "Weekly" ? "day" : "month";


  return (
    <Card className={`shadow-card cursor-default ${height}`}>
      <CardHeader>
        <CardTitle className="font-display">
          {heading} Revenue & Commission
        </CardTitle>
      </CardHeader>

      {loading && <LoadingSpot />}

      <CardContent className="h-[400px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No revenue data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey={xKey} />

              <YAxis tickFormatter={formatCurrency} />

              <Tooltip
                formatter={(value) => formatCurrency(value)}
                labelStyle={{ fontWeight: 600 }}
              />

              <Legend />

              {/* Revenue Gradient */}
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="15%" stopOpacity={0.5} stopColor="#2563eb" />
                  <stop offset="95%" stopOpacity={0} stopColor="#2563eb" />
                </linearGradient>

                {/* Commission Gradient */}
                <linearGradient id="commissionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="15%" stopOpacity={0.5} stopColor="#16a34a" />
                  <stop offset="95%" stopOpacity={0} stopColor="#16a34a" />
                </linearGradient>
              </defs>

              {/* Revenue */}
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#2563eb"
                fill="url(#revenueGradient)"
                strokeWidth={2}
              />

              {/* Commission */}
              <Area
                type="monotone"
                dataKey="commission"
                name="Commission"
                stroke="#16a34a"
                fill="url(#commissionGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
