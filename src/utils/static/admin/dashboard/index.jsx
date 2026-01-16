import { DollarSign, Store, TrendingUp, Users } from "lucide-react";

// dashbord heading
export const data = {
  heading: "Admin Dashboard",
  para: "Platform overview and management",
};
// card data
export const intialData = {
  totalVendor: {
    title: "Total Vendor",
    value: "$0",
    icon: Store,
    iconBg: "bg-blue-100 text-blue-700",
  },
  platformRevenue: {
    title: "Platform Revenue",
    value: "0",
    icon: DollarSign,
    iconBg: "bg-green-100 text-green-700",
  },
  platformEarnings: {
    title: "Platform Earnings",
    value: "0",
    icon: TrendingUp,
    iconBg: "bg-red-100 text-red-700",
    negative: true,
  },
  totalUser: {
    title: "Users",
    value: "0",
    icon: Users,
    iconBg: "bg-cyan-100 text-cyan-700",
  },
};
// order data
export const orderData = {
  title: "Recent Orders",
  subtitle: "Latest customer orders",
  endPoint:"/admin/getallorderforadmin",
  navigateData:"/admin/orders"
};
export const orderColumns =[
  {
    header: "Order ID",
    accessor: "id",
    render: (row) => (
      <span className="font-medium text-sm text-gray-900">
        ORD-{row.id}
      </span>
    ),
  },

  {
    header: "Customer",
    accessor: "customer",
    render: (row) => (
      <div>
        <p>{row.customer?.name || "N/A"}</p>
      </div>
    ),
  },

  {
    header: "Vendor",
    accessor: "vendor",
    render: (row) => (
      <span className="text-sm">
        {row.customer?.shop?.name || "N/A"}
      </span>
    ),
  },

  {
    header: "Items",
    accessor: "items",
    render: (row) => (
      <span className="text-sm">
        {row.items?.length || 0} items
      </span>
    ),
  },

  {
    header: "Total",
    accessor: "totalPrice",
    render: (row) => (
      <span>
        ${(row.totalPrice||0).toLocaleString()}
      </span>
    ),
  },

  {
    header: "Status",
    accessor: "status",
    render: (row) => {
      const statusStyles = {
        pending: "bg-yellow-100 text-yellow-800",
        processing: "bg-orange-100 text-orange-800",
        shipped: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-600",
      };

      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
            statusStyles[row.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {row.status}
        </span>
      );
    },
  },

  {
    header: "Date",
    accessor: "createdAt",
    render: (row) => (
      <span className="text-sm text-gray-600">
        {new Date(row.createdAt).toISOString().split("T")[0]}
      </span>
    ),
  },
];

// product data
export const producDashboardtData = {
  title: "Top Products",
  subtitle: "Best  items",
  endPoint:"/admin/admingetallproducts",
  navigateData:"/admin/products"
};
// vendor column
export const productColumns =[
  {
    header: "Product",
    accessor: "product",
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
          {row.images?.[0]?.url ? (
            <img
              src={row.images[0].url}
              alt={row.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 font-medium">
              {row.name?.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-gray-500">
            {row.description?.slice(0, 40)}...
          </p>
        </div>
      </div>
    ),
  },
  {
    header: "Vendor",
    accessor: "vendor",
    render: (row) => row.shop?.name || "N/A",
  },
  {
    header: "Category",
    accessor: "category",
    render: (row) => row.category?.name || "N/A",
  },
  {
    header: "Price",
    accessor: "price",
    render: (row) => `$${row.price.toLocaleString()}`,
  },
  {
    header: "Stock",
    accessor: "stock",
    render: (row) => row.stock,
  },
  {
    header: "Status",
    accessor: "status",
    render: (row) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === "active"
            ? "bg-purple-100 text-purple-800"
            : "bg-red-200 text-red-500"
        }`}
      >
        {row.status}
      </span>
    ),
  },
];

// vendor data
export const vendorData = {
  title: "Vendors",
  subtitle: "All registered vendors",
  endPoint:"/admin/getallvendorsforadmin",
  navigateData:"/admin/vendors"
};
// vendor column
export const vendorColumns = [
  {
    header: "ID",
    render: (row) => `${row.id}`,
  },
  {
    header: "NAME",
    render: (row) => row.name || "—",
  },
  {
    header: "EMAIL",
    render: (row) => row.email || "—",
  },
  {
    header: "SHOP NAME",
    render: (row) => row.shop?.name || "N/A",
  },
  {
    header: "PRODUCTS",
    render: (row) => row.totalProducts ?? 0,
  },
  {
    header: "Orders",
    render: (row) => row.totalOrders ?? 0,
  },
  {
    header: "Revenue",
    render: (row) => row.totalRevenue ?? 0,
  },
  {
    header: "Commission",
    render: (row) => `${row.commissionPercent}%` ?? 0,
  },
];
