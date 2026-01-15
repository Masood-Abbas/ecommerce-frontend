import FilterData from "@/components/admin/shared/FilterData";
import PageHeader from "@/components/admin/shared/pageHeader";
import { getUserColumns, userData } from "@/utils/static/admin/userData";

export default function UserPage() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <PageHeader data={userData} />

      <FilterData
        url="/admin/getalluser"
        columns={getUserColumns}
        placeholder="Search user name..."
      />
    </div>
  );
}
