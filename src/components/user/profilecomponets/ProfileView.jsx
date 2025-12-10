import { Button } from "@/components/ui/button";
import OrderCard from "../orders/Orders";
import { data } from "@/utils/static/cardData";
import { useSelector } from "react-redux";
// import { useSelector } from "react-redux";

export default function ProfileView({ profile, setActiveTab }) {
  const orderLists = useSelector((state) => state.orders.list.orders);

  const orderData = orderLists?.slice(0, 2) || [];
  console.log("orderData", orderData);

  return (
    <div className="space-y-8">
      {/*  HEADER  */}
      <div className="bg-gradient-to-r from-(--primary-color) to-[#873d3d] text-white rounded-2xl p-6 flex items-center gap-5 shadow-lg">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
          {profile.name?.charAt(0)}
        </div>

        <div>
          <h2 className="text-2xl font-semibold">{profile.name}</h2>
          <p className="text-sm opacity-90">{profile.email}</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs flex items-center gap-1 opacity-90">
              {profile.role}
            </span>
          </div>
        </div>
      </div>

      {/*  Personal Information  */}
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <Button
            onClick={() => setActiveTab("editProfile")}
            className="text-white  bg-(--primary-color) hover:bg-(--hover-primary-color)"
          >
            Edit
          </Button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <p className="text-gray-500">Full Name</p>
            <div className="border rounded-md p-2 text-gray-700">
              {profile.name || "N/A"}
            </div>
          </div>

          <div>
            <p className="text-gray-500">Email Address</p>
            <div className="border rounded-md p-2 text-gray-700">
              {profile.email || "N/A"}
            </div>
          </div>

          <div>
            <p className="text-gray-500">Role</p>
            <div className="border rounded-md p-2 text-gray-700">
              {profile.role || "user"}
            </div>
          </div>
        </div>
      </div>

      {/*  ORDER HISTORY  */}
      <OrderCard orders={orderData} data={data} setActiveTab={setActiveTab} />
    </div>
  );
}
