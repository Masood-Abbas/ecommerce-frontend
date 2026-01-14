import { useState } from "react";
import FilterData from "@/components/admin/shared/FilterData";
import PageHeader from "@/components/admin/shared/pageHeader";
import CategoryFormDialog from "@/components/admin/categoryComponent/CategoryForm";
import { categoryData, CategoryStatus, getCategoryColumns } from "@/utils/static/admin/categoryData";
// import {
//   getCategoryColumns,
//   CategoryStatus,
// } from "@/utils/static/admin/categoryData";

export default function AdminCategory() {
  const [open, setOpen] = useState(false);
  const [fetchCategories, setFetchCategories] = useState(null);

  return (
    <div className="p-4 space-y-6">
      <PageHeader
        data={categoryData}
        buttonLabel="Add Category"
        onButtonClick={() => setOpen(true)}
      />

      <FilterData
        url="/admin/getallcategoryforadmin"
        columns={getCategoryColumns}
        placeholder="Search category name..."
        selectOptions={CategoryStatus}
        onRefetch={setFetchCategories}   
      />

      <CategoryFormDialog
        open={open}
        setOpen={setOpen}
        mode="add"
        onSuccess={() => fetchCategories?.()}  
      />
    </div>
  );
}
