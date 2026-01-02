import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function RevenueChart({ data }) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-display">Monthly Revenue</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
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
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
