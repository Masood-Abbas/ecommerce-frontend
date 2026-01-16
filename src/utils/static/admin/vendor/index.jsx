import VendorActions from "@/components/admin/vendorComponent/vendorAction";
import { CheckCircle, UserCheck, XCircle } from "lucide-react";

export const data = {
    heading: "Vendor Management",
    para: "Manage and monitor all marketplace vendors",
  };
// initial user Data
  export const intiaVendorData = {
  totalVendor: {
    title: "Total Vendor",
    value: "0",
    icon: UserCheck,
    iconBg: "bg-cyan-100 text-cyan-700",
    negative: true,
  },
  activeUser: {
    title: "Active User",
    value: "0",
    icon: CheckCircle ,
    iconBg: "bg-green-100 text-green-800",
  },
  inActiveUser: {
    title: "inActive User",
    value: "0",
    icon: XCircle,
    iconBg: "bg-red-100 text-red-700",
  },
};

// coloums
  export const getColumns =(fetchApi)=> [
    {
      header: "vendor",
      accessor: "Vendor",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-(--primary-color) flex items-center justify-center">
          {row?.images?.[0]?.url ? (
            <img
              src={row.images[0].url}
              alt={row.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-medium ">
              {row?.name?.charAt(0) || "S"}
            </span>
          )}
        </div>
          <div>
            <p className="font-medium">{ row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Shop Name",
      accessor: "Shop Name",
      render: (row) => `${row.shop?.name}`,
    },
    {
      header: "Total Products",
      accessor: "Products",
      render: (row) => `${row.totalProducts.toLocaleString()}`,
    },
    {
      header: "Total Orders",
      accessor: "Orders",
      render: (row) => `${row.totalOrders.toLocaleString()}`,
    },
    {
      header: "Total Revenue",
      accessor: "Revenue",
      render: (row) => `$${row.totalRevenue.toLocaleString()}`,
    },
    {
      header: "Commission",
      accessor: "Commission",
      render: (row) => `${row.commissionPercent}%`,
    },
    {
    header: "Status",
    accessor: "status",
    render: (row) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {row.status}
      </span>
    ),
  },
    {
    header: "Actions",
    accessor: "actions",
    render: (row) => (
      <VendorActions
        data={row}
        onRefresh={fetchApi}
      />
    ),
  },
  ];