import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

/* ---------------- Utils ---------------- */
const formatCurrency = (v = 0) => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}k`;
  return `$${v}`;
};

export default function TopPerformingVendors({ data }) {
//  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Vendors</CardTitle>
        <CardDescription>By revenue this month</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[400px]">
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No vendor data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="var(--primary-color)"
                  horizontal={false}
                />

                <XAxis
                  type="revenue"
                  tickFormatter={formatCurrency}
                  className="text-xs"
                />

                <YAxis
                  type="category"
                  dataKey="vendorName"
                  width={120}
                  className="text-xs"
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid gray",
                  }}
                  formatter={(value) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                />

                <Bar
                  dataKey="revenue"
                  fill="var(--primary-color)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
