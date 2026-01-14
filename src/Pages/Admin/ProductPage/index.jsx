import FilterData from "@/components/admin/shared/FilterData";
import PageHeader from "@/components/admin/shared/pageHeader";
import {
  getProductColumns,
  productData,
  ProductStatus,
} from "@/utils/static/admin/ProductData";

export default function AdminProduct() {
  return (
    <div className="p-4 space-y-6">
      <PageHeader data={productData} />

      <FilterData
        url="/admin/admingetallproducts"
        columns={getProductColumns}
        placeholder="Search product name..."
        selectOptions={ProductStatus}
      />
    </div>
  );
}
