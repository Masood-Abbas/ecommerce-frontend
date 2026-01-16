import FilterData from "@/components/admin/shared/FilterData";
import PageHeader from "@/components/admin/shared/pageHeader";
import { StatCard } from "@/components/admin/shared/stateCard";
import { useDashboardStats } from "@/hooks/useAdminState";
import { mapStatsFromApi } from "@/utils/admin/adminStateMapper";
import {
  getOrderColumns,
  intialOrderData,
  orderData,
  OrderStatus,
} from "@/utils/static/admin/orderData";

export default function AdminOrder() {
  const { stats, loading, error } = useDashboardStats(
    "/admin/ordersummary",
    intialOrderData,
    mapStatsFromApi
  );
  return (
    <div className="p-4 space-y-6">
      <PageHeader data={orderData} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(stats).map(([key, value]) => (
          <StatCard
            key={key}
            title={value.title || "Users"}
            value={value.value || "0"}
            negative={value.negative}
            icon={value.icon}
            iconBg={value.iconBg}
            cla
          />
        ))}
      </div>

      <FilterData
        url="/admin/getallorderforadmin"
        columns={getOrderColumns}
        placeholder="Search order ID and customer name..."
        selectOptions={OrderStatus}
      />
    </div>
  );
}
