import ProductActions from "@/components/admin/ProductComponent/ProductAction";

export const productData = {
  heading: "Product Management",
  para: "Review and manage all marketplace products",
};
// selectoption
export const ProductStatus = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "inActive" },
];
// column
export const getProductColumns = (fetchApi) => [
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
  {
    header: "Actions",
    accessor: "actions",
    render: (row) => <ProductActions data={row} onRefresh={fetchApi} />,
  },
];
