import { CheckCircle, Clock, Package, XCircle } from "lucide-react";

export const orderData = {
  heading: "Order Management",
  para: "View and manage all marketplace orders",
};
// intialData
export const intialOrderData = {
  totalOrder: {
    title: "Total Order",
    value: "0",
    icon: Package,
    iconBg: "bg-blue-100 text-blue-700",
  },

  pendingOrders: {
    title: "Pending Orders",
    value: "0",
    icon: Clock,
    iconBg: "bg-cyan-100 text-cyan-700",
    negative: true,
  },
  deliveredOrders: {
    title: "Delivered Orders",
    value: "0",
    icon:CheckCircle ,
    iconBg: "bg-green-100 text-green-800",
  },
  cancelledOrders: {
    title: "Cancelled Orders",
    value: "0",
    icon: XCircle,
    iconBg: "bg-red-100 text-red-700",
  },
};
// selectoption
export const OrderStatus = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];
// column
export const getOrderColumns = () => [
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

