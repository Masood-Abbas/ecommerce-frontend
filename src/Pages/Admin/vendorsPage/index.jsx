import FilterData from "@/components/admin/FilterData";
import PageHeader from "@/components/admin/pageHeader";
import { columns, data } from "@/utils/static/admin/vendor";

export default function Vendor() {
 

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <PageHeader data={data}/>

      <FilterData
        url="/admin/getAllVendorsForAdmin"
        columns={columns}
        placeholder='Search vendor name...'
      />
    </div>
  );
}
