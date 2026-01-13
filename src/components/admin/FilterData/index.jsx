import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PaginationSection from "@/components/user/shared/pagination";
import SearchInputApi from "@/components/vendor/searchInput";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import DataTable from "../DataTable";

const FilterData = ({ url, columns, title = "Data Table" ,placeholder}) => {

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [searchText, setSearchText] = useState("");

console.log("data",data)

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const { fetchApi, loading } = useApiResponse({ method: "get" });

  // Fetch data from API
  const fetchData = async () => {
    const params = {
      page,
      limit,
      search: searchText || undefined,
    };
    
    const res = await fetchApi(params, url);

    if (res?.data) {
      setData(res.data ? res.data.data.data : []);
      setPagination(res.data.data.pagination || {});
    }
  };

  useEffect(() => {
    fetchData();
  }, [ page, searchText, url]);

  // Handlers
  const handleSearch = (text) => {
    setSearchText(text);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const goToPage = (p) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", p);
    setSearchParams(newParams);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white py-5 px-4 border border-gray-200 rounded-xl">
        <SearchInputApi onResults={handleSearch} className="bg-gray-100" placeholder={placeholder}/>
      </div>

      {/* Table */}
      <DataTable
        // title={title}
        // subtitle={`Total records: ${pagination.totalData || 0}`}
        columns={columns}
        rows={data}
        loading={loading}
        className="bg-gray-100 text-black"
        padding="py-0"
      />

      {/* Pagination */}
      <PaginationSection
        pagination={{
          page: pagination.currentPage || 1,
          totalPages: pagination.totalPages || 1,
          totalRecords: pagination.totalRecords || 0,
        }}
        goToPage={goToPage}
      />
    </div>
  );
};

export default FilterData;
