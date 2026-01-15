import { useState } from "react";
import FilterData from "@/components/admin/shared/FilterData";
import PageHeader from "@/components/admin/shared/pageHeader";
import CategoryFormDialog from "@/components/admin/categoryComponent/CategoryForm/CategoryForm";
import { categoryData, CategoryStatus, getCategoryColumns } from "@/utils/static/admin/categoryData";


export default function AdminCategory() {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-4 space-y-6">
      <PageHeader
        data={categoryData}
        buttonLabel="Add Category"
        onButtonClick={() => setOpen(true)}
      />

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
        onSuccess={() => setRefreshKey(prev => prev + 1)} // ✅
      />
    </div>
  );
}
