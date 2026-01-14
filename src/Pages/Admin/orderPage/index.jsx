import FilterData from "@/components/admin/shared/FilterData";
import PageHeader from "@/components/admin/shared/pageHeader";
import {
  getOrderColumns,
  orderData,
  OrderStatus,
} from "@/utils/static/admin/orderData";

export default function AdminOrder() {
  return (
    <div className="p-4 space-y-6">
      <PageHeader data={orderData} />

      <FilterData
        url="/admin/getallorderforadmin"
        columns={getOrderColumns}
        placeholder="Search order ID and customer name..."
        selectOptions={OrderStatus}
      />
    </div>
  );
}
