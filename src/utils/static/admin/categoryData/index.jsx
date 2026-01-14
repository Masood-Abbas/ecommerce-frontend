
export const categoryData = {
  heading: "Order Management",
  para: "View and manage all marketplace orders",
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
              : "bg-gray-100 text-gray-600"
          }
        `}
      >
        {row.status}
      </span>
    ),
  },
];

