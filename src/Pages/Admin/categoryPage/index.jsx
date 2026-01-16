import { useState } from "react";
import FilterData from "@/components/admin/shared/FilterData";
import PageHeader from "@/components/admin/shared/pageHeader";
import CategoryFormDialog from "@/components/admin/categoryComponent/CategoryForm/CategoryForm";
import {
  categoryData,
  CategoryStatus,
  getCategoryColumns,
  intialCategoryData,
} from "@/utils/static/admin/categoryData";
import { useDashboardStats } from "@/hooks/useAdminState";
import { mapStatsFromApi } from "@/utils/admin/adminStateMapper";
import { StatCard } from "@/components/admin/shared/stateCard";

export default function AdminCategory() {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { stats, loading, error } = useDashboardStats(
    "/admin/categorysummary",
    intialCategoryData,
    mapStatsFromApi
  );

  return (
    <div className="p-4 space-y-6">
      <PageHeader
        data={categoryData}
        buttonLabel="Add Category"
        onButtonClick={() => setOpen(true)}
      />

      
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

      <FilterData
        key={refreshKey}
        url="/admin/getallcategoryforadmin"
        columns={getCategoryColumns}
        placeholder="Search category name..."
        selectOptions={CategoryStatus}
      />

      <CategoryFormDialog
        open={open}
        setOpen={setOpen}
        mode="add"
        onSuccess={() => setRefreshKey((prev) => prev + 1)} // ✅
      />
    </div>
  );
}
