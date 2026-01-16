import FilterData from "@/components/admin/shared/FilterData";
import PageHeader from "@/components/admin/shared/pageHeader";
import { StatCard } from "@/components/admin/shared/stateCard";
import { getProductColumns, productData, ProductStatus, intialProductData } from "@/utils/static/admin/ProductData";
import { mapStatsFromApi } from "@/utils/admin/adminStateMapper";
import { useDashboardStats } from "@/hooks/useAdminState";

export default function AdminProduct() {
  const { stats, loading, error } = useDashboardStats(
    "/admin/productsummary",
    intialProductData,
    mapStatsFromApi
  );

  return (
    <div className="p-4 space-y-6">
      <PageHeader data={productData} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(stats).map(([key, value]) => (
          <StatCard
            key={key}
            title={value.title || "Users"}
            value={value.value || "0"}
            negative={value.negative}
            icon={value.icon}
            iconBg={value.iconBg}
          />
        ))}
      </div>

      {/* Filter & Table */}
      <FilterData
        url="/admin/admingetallproducts"
        columns={getProductColumns}
        placeholder="Search product name..."
        selectOptions={ProductStatus}
      />

      {/* Error Message */}
      {error && (
        <p className="text-center py-10 text-red-600">
          {typeof error === "string" ? error : error?.message || "Something went wrong"}
        </p>
      )}
    </div>
  );
}
