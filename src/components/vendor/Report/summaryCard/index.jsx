import { TrendingUp, TrendingDown, Package, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SummaryCards({ summary }) {
  const { totalRevenue, totalOrders, avgOrderValue } = summary;

  const cards = [
    {
      label: "Annual Revenue",
      value: `$${Number(totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      iconBg: "bg-blue-100 text-blue-700",
    },
    {
      label: "Total Orders",
      value: Number(totalOrders || 0).toLocaleString(),
      icon: Package,
      iconBg: "bg-cyan-100 text-cyan-700",
    },
    {
      label: "Avg Order Value",
      value: `$${Number(avgOrderValue || 0).toFixed(2)}`,
      icon: TrendingUp,
      iconBg: "bg-green-100 text-green-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((c) => (
        <Card
          key={c.label}
          className="shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <CardContent className="py-2 px-5 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="text-2xl font-semibold font-display mt-1">{c.value}</p>
            </div>
            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center ${c.iconBg}`}
            >
              <c.icon className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
