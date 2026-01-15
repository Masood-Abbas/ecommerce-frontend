import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function UserGrowthChart({ data = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>Active users over time</CardDescription>
      </CardHeader>
      {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No revenue data available
          </div>
        ):
      (<CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3"  />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis
                className="text-xs"
                allowDecimals={false}
                domain={[0, "dataMax + 1"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  // border: "1px solid gray",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="red"
                strokeWidth={2}
                dot={{ r: 4, fill: "red" }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>)}
    </Card>
  );
}
