import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PaginationSection from "@/components/user/shared/pagination";
import SearchInputApi from "@/components/vendor/searchInput";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import DataTable from "../DataTable";

const FilterData = ({ url, columns, title = "Data Table", placeholder, selectOptions ,roleOptions}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(""); 
  const [roleFilter, setRoleFilter] = useState(""); 

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
      status: selectedFilter || undefined, 
      role: roleFilter || undefined, 
    };

    const res = await fetchApi(params, url);

    if (res?.data) {
      setData(res.data ? res.data.data.data : []);
      setPagination(res.data.data.pagination || {});
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchText, selectedFilter,roleFilter, url]); 
  
  // Handlers
  const handleSearch = (text) => {
    setSearchText(text);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleSelectChange = (e) => {
    setSelectedFilter(e.target.value);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
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
      {/* Search & Filter */}
      <div className="bg-white py-5 px-4 border border-gray-200 rounded-xl flex flex-col md:flex-row md:items-center md:gap-4">
        <SearchInputApi
          onResults={handleSearch}
          className="bg-gray-100 flex-1"
          placeholder={placeholder}
        />

        {selectOptions && (
          <select
            value={selectedFilter}
            onChange={handleSelectChange}
            className="mt-3 md:mt-0 p-2 border border-gray-300 rounded-lg bg-gray-100"
          >
            <option value="">All</option>
            {selectOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
        {roleOptions && (
          <select
            value={roleFilter}
            onChange={handleRoleChange}
            className="mt-3 md:mt-0 p-2 border border-gray-300 rounded-lg bg-gray-100"
          >
            <option value="">All</option>
            {roleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Table */}
      <DataTable
        columns={typeof columns === "function" ? columns(fetchData) : columns}
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
