import UserActions from "@/components/admin/userComponent/UserAction";
import { CheckCircle, User, UserCheck, XCircle } from "lucide-react";


export const userData = {
    heading: "User Management",
    para: "Manage customers and admin users",
  };
  // initial user Data
  export const intiaUserData = {
  totalUser: {
    title: "Total User",
    value: "0",
    icon: User,
    iconBg: "bg-blue-100 text-blue-700",
  },

  totalVendor: {
    title: "Vendor",
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
// status
export const userStatus = [
  { value: "admin", label: "admin" },
  { value: "vendor", label: "vendor" },
  { value: "user", label: "user" },
];
// column 
  export const getUserColumns = (fetchApi) => [
  {
    header: "User",
    accessor: "user",
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-(--primary-color) text-white flex items-center justify-center">
          <span className="text-white font-medium">
            {row?.name?.charAt(0) || "U"}
          </span>
        </div>
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    header: "Role",
    accessor: "role",
    render: (row) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.role === "admin"
            ? "bg-purple-100 text-purple-700"
            : row.role === "vendor"
            ? "bg-blue-100 text-blue-700"
            : "bg-orange-100 text-orange-700"
        }`}
      >
        {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
      </span>
    ),
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
    header: "Orders",
    accessor: "orders",
    render: (row) => row.orders,
  },
  {
    header: "Total Spent",
    accessor: "totalSpent",
    render: (row) => `$${row.totalSpent.toLocaleString()}`,
  },
  {
    header: "Joined",
    accessor: "joined",
    render: (row) => new Date(row.joined).toLocaleDateString(),
  },
  {
    header: "Actions",
    accessor: "actions",
    render: (row) => (
      <UserActions data={row} onRefresh={fetchApi} />
    ),
  },
];
