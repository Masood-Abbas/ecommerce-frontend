import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useApiResponse } from "@/hooks/ResponseApiHook";

import Orders from "@/components/user/orders/Orders";
import Sidebar from "@/components/user/profilecomponets/Sidebar";
import ProfileEdit from "@/components/user/profilecomponets/ProfileEdit";
import ProfileView from "@/components/user/profilecomponets/ProfileView";
import { setOrders } from "@/Redux/orderSlice/orderSlice";
import Seller from "@/components/user/profilecomponets/Seller";

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.user);

  const [searchParams, setSearchParams] = useSearchParams();

  const defaultTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(defaultTab);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    const params = { tabs: activeTab };
    if (activeTab === "orders") {
      params.page = searchParams.get("page") || 1;
      params.limit = searchParams.get("limit") || 10;
    }
    setSearchParams(params);
  }, [activeTab]);

  // Fetch Profile API
  const { fetchApi: fetchProfile } = useApiResponse({
    endpoint: `/user/getSingleUser/${user.id}`,
    method: "get",
  });

  // Fetch Orders API (stores data in Redux)
  const { fetchApi: fetchOrders } = useApiResponse({
    endpoint: `/order/getuserorder/${user.id}`,
    method: "get",
    reduxAction: setOrders,
  });

  // Load Profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      const response = await fetchProfile();
      if (response?.data?.data) {
        setProfile(response.data.data);
      }
    };

    loadProfile();

    fetchOrders();
  }, [user.id, activeTab]);

  return (
    <div className="main-container mt-10 p-4 grid grid-cols-12 gap-6">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
      />

      {/* Main Content */}
      <div className="col-span-12 md:col-span-9">
        {activeTab === "profile" && (
          <ProfileView profile={profile} setActiveTab={setActiveTab} />
        )}

        {activeTab === "editProfile" && (
          <ProfileEdit
            profile={profile}
            setProfile={setProfile}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "orders" && <Orders />}
        {/* seller */}
        {activeTab === "seller" && <Seller />}
      </div>
    </div>
  );
}
