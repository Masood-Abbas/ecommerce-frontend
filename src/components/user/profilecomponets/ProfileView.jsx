import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";


import { data } from "@/utils/static/cardData";
import { useSelector } from "react-redux";
import Orders from "../orders/Orders";

export default function ProfileView({ profile, setActiveTab }) {
  const orderLists = useSelector((state) => state.orders.list.orders);
  const orderData = orderLists?.slice(0, 2) || [];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <Card className="bg-linear-to-r from-(--primary-color) to-[#873d3d] text-white shadow-xl rounded-2xl">
        <CardContent className="flex items-center gap-6 py-6">

          <Avatar className="w-20 h-20 text-3xl border-2 border-white">
            <AvatarFallback className="bg-white/20 text-white">
              {profile.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-2xl font-semibold">{profile.name}</h2>
            <p className="text-sm opacity-90">{profile.email}</p>

            <div className="flex gap-2 mt-2">
              <span className="text-xs opacity-90 px-2 py-1 bg-white/20 rounded-md">
                {profile.role}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PERSONAL INFO */}
      <Card className="shadow-lg rounded-xl">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-lg">Personal Information</CardTitle>
          <Button
            onClick={() => setActiveTab("editProfile")}
            className="bg-(--primary-color) hover:bg-(--hover-primary-color) text-white"
          >
            Edit
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="text-gray-500">Full Name</p>
            <div className="border rounded-md p-2 mt-1 text-gray-700">
              {profile.name || "N/A"}
            </div>
          </div>

          <div>
            <p className="text-gray-500">Email Address</p>
            <div className="border rounded-md p-2 mt-1 text-gray-700">
              {profile.email || "N/A"}
            </div>
          </div>

          <div>
            <p className="text-gray-500">Role</p>
            <div className="border rounded-md p-2 mt-1 text-gray-700">
              {profile.role || "user"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ORDER HISTORY */}
      <Separator />
      <Orders orderData={orderData} data={data} setActiveTab={setActiveTab} />
    </div>
  );
}
