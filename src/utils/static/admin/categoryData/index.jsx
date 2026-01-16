import CategoryActions from "@/components/admin/categoryComponent/CategoryAction";
import { CheckCircle, FolderTree, XCircle } from "lucide-react";

export const categoryData = {
  heading: "Order Management",
  para: "View and manage all marketplace orders",
};
// intialData
export const intialCategoryData = {
  totalCategory: {
    title: "Total Category",
    value: "0",
    icon: FolderTree,
    iconBg: "bg-blue-100 text-blue-700",
  },

  ActiveCategory: {
    title: "Active Category",
    value: "0",
    icon: CheckCircle,
    iconBg: "bg-cyan-100 text-cyan-700",
    negative: true,
  },
  InActiveCategory: {
    title: "inActive Category",
    value: "0",
    icon: XCircle,
    iconBg: "bg-red-100 text-red-700",
  },
};
// selectoption
export const CategoryStatus = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "InActive" },
];
// column
export const getCategoryColumns = (fetchData) => [
    {
    header: "ID",
    accessor: "ID",
    render: (row) => (
      <span className="font-medium text-gray-900">
        {row.id}
      </span>
    ),
  },
  {
    header: "Name",
    accessor: "name",
    render: (row) => (
      <span className="font-medium text-gray-900">
        {row.name}
      </span>
    ),
  },
  {
    header: "Products",
    accessor: "products",
    render: (row) => (
      <span className="text-sm text-gray-900">
        {row._count.products}
      </span>
    ),
  },

  {
    header: "Status",
    accessor: "status",
    render: (row) => (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium capitalize
          ${
            row.status === "active"
              ? "bg-purple-100 text-purple-700"
              : "bg-orange-100 text-orange-600"
          }
        `}
      >
        {row.status}
      </span>
    ),
  },

  {
      header: "Actions",
      accessor: "actions",
      render: (row) => <CategoryActions data={row} onRefresh={fetchData} />,
    },
];

