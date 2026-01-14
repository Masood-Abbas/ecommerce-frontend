import VendorActions from "@/components/admin/vendorComponent/vendorAction";

export const data = {
    heading: "Vendor Management",
    para: "Manage and monitor all marketplace vendors",
  };

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
      render: (row) => `$${row.totalProducts.toLocaleString()}`,
    },
    {
      header: "Total Orders",
      accessor: "Orders",
      render: (row) => `$${row.totalOrders.toLocaleString()}`,
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