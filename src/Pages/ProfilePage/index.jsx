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

  // Read URL param
  const urlTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(urlTab);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  // Sync URL → activeTab
  useEffect(() => {
    setActiveTab(urlTab);
  }, [urlTab]);

  // Update URL when activeTab changes
  useEffect(() => {
    const params = { tab: activeTab };

    if (activeTab === "orders") {
      params.page = searchParams.get("page") || 1;
      params.limit = searchParams.get("limit") || 10;
    }

    setSearchParams(params);
  }, [activeTab]);

  const { fetchApi: fetchProfile } = useApiResponse({
    endpoint: `/user/getSingleUser/${user.id}`,
    method: "get",
  });

  const { fetchApi: fetchOrders } = useApiResponse({
    endpoint: `/order/getuserorder/${user.id}`,
    method: "get",
    reduxAction: setOrders,
  });

  // Load data depending on active tab
  useEffect(() => {
    const loadProfile = async () => {
      const response = await fetchProfile();
      if (response?.data?.data) {
        setProfile(response.data.data);
      }
    };

    loadProfile();

    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [user.id, activeTab]);

  return (
    <div className="main-container mt-10 p-4 grid grid-cols-12 gap-6">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
      />

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

        {activeTab === "seller" && <Seller />}
      </div>
    </div>
  );
}
