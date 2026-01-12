import { useEffect, useState } from "react";
import { Mail, Phone, DollarSign, Package, TrendingUp } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import PaginationSection from "@/components/user/shared/pagination";
import SearchInputApi from "@/components/vendor/searchInput";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { getInitials } from "@/utils/helperFunction/getInitialsName";
import { StatCard } from "@/components/vendor/dashboard/stateCard";




export default function CustomersDashboard() {
  const [customers, setCustomers] = useState([]);
  const [summary, setSummary] = useState({
    totalCustomers: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
  });
  const [pagination, setPagination] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const limit = 10;

  const { fetchApi, loading } = useApiResponse({ method: "get" });

// Fetch Customers  
  const fetchCustomers = async () => {
    try {
      const res = await fetchApi(
        { page, limit, search },
        "/vendor/getallcustomerbyshop"
      );

      if (res?.data?.success) {
        const { customers = [], pagination = {} } = res.data.data;
        setCustomers(customers);
        setPagination(pagination);

        const totalRevenue = customers.reduce(
          (sum, c) => sum + (c.totalSpent || 0),
          0
        );
        const totalOrders = customers.reduce(
          (sum, c) => sum + (c.totalOrders || 0),
          0
        );

        setSummary({
          totalCustomers: pagination.totalCustomers || 0,
          totalRevenue,
          avgOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
        });
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, search]);

// search handler
  const handleSearch = (text) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", text);
    params.set("page", "1");
    setSearchParams(params);
  };

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p);
    setSearchParams(params);
  };

  /*  Summary Cards Array  */
  const summaryCards = [
    {
      title: "Total Customers",
      value: summary.totalCustomers,
      icon: Package,
      iconBg: "bg-cyan-100 text-cyan-700",
    },
    {
      title: "Total Revenue",
      value: `${summary.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      iconBg: "bg-blue-100 text-blue-700",
    },
    {
      title: "Avg Order Value",
      value: `$${summary.avgOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      iconBg: "bg-green-100 text-green-700",
    },
  ];

  return (
    <div className="p-4 ">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Customers</h2>
        <p className="text-muted-foreground">
          Manage your customer relationships efficiently
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {summaryCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            iconBg={card.iconBg}
          />
        ))}
      </div>

      {/* Search */}
      <div className="mb-6 bg-white p-4 border rounded-xl">
        <SearchInputApi onResults={handleSearch} className="bg-gray-100" />
      </div>

      {/* Customers Table */}
      <div className="border rounded-xl  cursor-default overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr className="text-base">
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Orders</th>
              <th className="p-4 text-left">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr
                  key={c.id}
                  className="border-t odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {/* Customer */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {c.avatar ? (
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                          {getInitials(c.name)}
                        </div>
                      )}
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="p-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {c.email}
                    </div>
                  </td>

                  {/* Orders */}
                  <td className="p-4 text-center font-medium">
                    {c.totalOrders || 0}
                  </td>

                  {/* Total Spent */}
                  <td className="p-4 text-center font-semibold">
                    ${Number(c.totalSpent || 0).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <PaginationSection
        pagination={{
          page: pagination.currentPage || 1,
          totalPages: pagination.totalPages || 1,
          totalRecords: pagination.totalCustomers || 0,
        }}
        goToPage={goToPage}
      />
    </div>
  );
}

