import FilterData from "@/components/admin/shared/FilterData";
import PageHeader from "@/components/admin/shared/pageHeader";
import { data, getColumns } from "@/utils/static/admin/vendor";

export default function Vendor() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <PageHeader data={data} />

      <FilterData
        url="/admin/getAllVendorsForAdmin"
        columns={getColumns}
        placeholder="Search vendor name..."
      />
    </div>
  );
}
