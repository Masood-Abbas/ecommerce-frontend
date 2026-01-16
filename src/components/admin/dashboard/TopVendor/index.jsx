import DataTable from "../../shared/DataTable";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { useEffect } from "react";

const DashbordTable = ({DashboardData,column}) => {
  const {title,subtitle,navigateData,endPoint}=DashboardData
  const { fetchApi, data, loading } = useApiResponse({
    endpoint: endPoint,
    method: "get",
  });

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <DataTable
      title={title}
      subtitle={subtitle}
      columns={column}
      rows={data?.data || []}
      loading={loading}
      navigateData={navigateData}
    />
  );
};

export default DashbordTable;
