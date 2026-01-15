import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpot from "@/components/ui/spinner/loadingSpiner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

/* ---------------- Utils ---------------- */
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const formatCurrency = (value = 0) =>
  typeof value === "number" ? currencyFormatter.format(value) : "$0";

const getXAxisKey = (period) => (period === "month" ? "month" : "day");

/* ---------------- Component ---------------- */
export default function RevenueCommissionChart({
  data,
  period = "day",
  loading = false,
}) {
  // 🔒 Always normalize data for Recharts
  const chartData = Array.isArray(data)
    ? data.map((item) => ({
        ...item,
        revenue: Number(item.revenue) || 0,
        commission: Number(item.commission) || 0,
      }))
    : [];

  const xAxisKey = getXAxisKey(period);

  return (
    <Card className="shadow-card h-full">
      <CardHeader>
        <CardTitle className="font-display">
          Revenue & Commissions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Platform earnings breakdown
        </p>
      </CardHeader>

      <CardContent className="h-[420px]">
        {loading ? (<LoadingSpot/>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No revenue data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              barGap={8}
              barCategoryGap="20%"
            >
              {/* Gradients */}
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#6D28D9" />
                </linearGradient>

                <linearGradient
                  id="commissionGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#4ADE80" />
                  <stop offset="100%" stopColor="#16A34A" />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey={xAxisKey}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                tickFormatter={formatCurrency}
                fontSize={12}
                width={80}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                formatter={(value) => formatCurrency(value)}
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                contentStyle={{ borderRadius: 8 }}
              />

              <Legend verticalAlign="top" height={36} iconType="circle" />

              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="url(#revenueGradient)"
                radius={[8, 8, 0, 0]}
                maxBarSize={48}
              />

              <Bar
                dataKey="commission"
                name="Commission"
                fill="url(#commissionGradient)"
                radius={[8, 8, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
