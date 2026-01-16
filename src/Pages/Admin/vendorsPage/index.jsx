import FilterData from "@/components/admin/shared/FilterData";
import PageHeader from "@/components/admin/shared/pageHeader";
import { StatCard } from "@/components/admin/shared/stateCard";
import { useDashboardStats } from "@/hooks/useAdminState";
import { mapStatsFromApi } from "@/utils/admin/adminStateMapper";
import { data, getColumns, intiaVendorData } from "@/utils/static/admin/vendor";

export default function Vendor() {
  const { stats, loading, error } = useDashboardStats(
        "/admin/vendorsummary",
        intiaVendorData,
        mapStatsFromApi
      );
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <PageHeader data={data} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        url="/admin/getAllVendorsForAdmin"
        columns={getColumns}
        placeholder="Search vendor name..."
      />
    </div>
  );
}
