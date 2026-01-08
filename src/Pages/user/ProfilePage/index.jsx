import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {  useSearchParams } from "react-router-dom";
import { useApiResponse } from "@/hooks/ResponseApiHook";

import Orders from "@/components/user/orders/Orders";
import Sidebar from "@/components/user/profilecomponets/Sidebar";
import ProfileEdit from "@/components/user/profilecomponets/ProfileEdit";
import ProfileView from "@/components/user/profilecomponets/ProfileView";
import Seller from "@/components/user/profilecomponets/Seller";
import { setOrders } from "@/Redux/orderSlice/orderSlice";

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
  const role = user.role;

  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL tab or default to 'profile'
  const urlTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(urlTab);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  // Fetch profile API hook
  const { fetchApi: fetchProfile } = useApiResponse({
    endpoint: `/user/getSingleUser/${user.id}`,
    method: "get",
  });

  // Fetch orders API hook
  const { fetchApi: fetchOrders } = useApiResponse({
    endpoint: `/order/getuserorder/${user.id}`,
    method: "get",
    reduxAction: setOrders,
  });

  //  Sync URL param to state 
  useEffect(() => {
    setActiveTab(urlTab);
  }, [urlTab]);

  //  Update URL when activeTab changes 
  useEffect(() => {
    let tabToSet = activeTab;
    if (role === "vendor" && activeTab === "seller") {
      tabToSet = "profile";
    }

    const params = { tab: tabToSet };

    if (tabToSet === "orders") {
      params.page = searchParams.get("page") || 1;
      params.limit = searchParams.get("limit") || 10;
    }

    setSearchParams(params);
    if (tabToSet !== activeTab) {
      setActiveTab(tabToSet);
    }
  }, [activeTab, role, searchParams, setSearchParams]);

  // Load profile and orders depending on active tab
  const loadProfile = async () => {
      const response = await fetchProfile();
      if (response?.data?.data) {
        setProfile(response.data.data);
      }
    };
  useEffect(() => {
    loadProfile();
      fetchOrders();
  }, [ activeTab]);

  const safeTab = role === "vendor" && activeTab === "seller" ? "profile" : activeTab;

  return (
     <div className="min-h-screen bg-background">
      <div className="main-container py-5 ">
        {/* Mobile Page Header */}
        <div className="md:hidden mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            My Account
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your profile and orders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <Sidebar
            activeTab={safeTab}
            setActiveTab={setActiveTab}
            profile={profile}
            role={role}
          />

          {/* Main Content */}
          <main className="md:col-span-8 lg:col-span-9 pb-24 md:pb-0">
            {safeTab === "profile" && (
              <ProfileView
                profile={profile}
                setActiveTab={setActiveTab}
              />
            )}

            {safeTab === "editProfile" && (
              <ProfileEdit
                profile={profile}
                setProfile={setProfile}
                setActiveTab={setActiveTab}
              />
            )}

            {safeTab === "orders" && <Orders />}

            {role !== "vendor" && safeTab === "seller" && <Seller />}
          </main>
        </div>
      </div>
    </div>
  );
}
