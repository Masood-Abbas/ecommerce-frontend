import DataTable from "../../shared/DataTable";
import { vendorColumns } from "@/utils/static/admin/dashboard";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { useEffect } from "react";

const TopVendors = () => {
  const { fetchApi, data, loading } = useApiResponse({
    endpoint: "/admin/getallvendorsforadmin",
    method: "get",
  });

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <DataTable
      title="Vendors"
      subtitle="All registered vendors"
      columns={vendorColumns}
      rows={data?.data || []}
      loading={loading}
      viewAllPath="/admin/vendors"
    />
  );
};

export default TopVendors;
