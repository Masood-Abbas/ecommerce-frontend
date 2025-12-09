import { Button } from "@/components/ui/button";

export default function ProfileView({ profile, setActiveTab }) {
  return (
    <div className="space-y-8">

      {/*  HEADER  */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 flex items-center gap-5 shadow-lg">
        
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

    


      {/* ================= ORDER HISTORY ================= */}
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">Order History</h3>
          <button className="text-purple-600 hover:underline text-sm">View All Orders ›</button>
        </div>

        {/* ORDER CARD 1 */}
        <div className="border rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">ORD-2024-001234</p>
              <p className="text-gray-500 text-sm">Dec 5, 2024</p>
            </div>
            <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-lg">
              Delivered
            </span>
          </div>

          <p className="text-gray-600 mt-2 text-sm">Wireless Headphones Pro, Phone Case</p>
          <div className="flex justify-between mt-3">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">2 items</span>
            <span className="font-semibold">$289.99</span>
          </div>
        </div>

        {/* ORDER CARD 2 */}
        <div className="border rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">ORD-2024-001198</p>
              <p className="text-gray-500 text-sm">Nov 28, 2024</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-lg">
              Shipped
            </span>
          </div>

          <p className="text-gray-600 mt-2 text-sm">Smart Watch Band, USB-C Cable</p>
          <div className="flex justify-between mt-3">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">3 items</span>
            <span className="font-semibold">$156.50</span>
          </div>
        </div>
      </div>
    </div>
  );
}
