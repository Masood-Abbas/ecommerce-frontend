import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import Orders from "@/components/user/orders/Orders";
import Sidebar from "@/components/user/profilecomponets/Sidebar";
import ProfileEdit from "@/components/user/profilecomponets/ProfileEdit";
import ProfileView from "@/components/user/profilecomponets/ProfileView";
import { setOrders } from "@/Redux/orderSlice/orderSlice";

export default function ProfilePage() {
  const data = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    Role: "",
    Password: "",
  });
  // from single user
  const { fetchApi } = useApiResponse({
    endpoint: `/user/getSingleUser/${data.id}`,
    method: "get",
  });

  // order;
  const { fetchApi: orderFetchAPi } = useApiResponse({
    endpoint: `/order/getuserorder/${data.id}`,
    method: "get",
    reduxAction: setOrders,
  });

  const handleFetch = async () => {
    const res = await fetchApi();
    const data = res.data.data;
    setProfile(data);
  };

  useEffect(() => {
    orderFetchAPi();
    handleFetch();
  }, [data.id]);

  return (
    <div className="main-container mt-10 p-4 grid grid-cols-12 gap-6">
      {/* LEFT SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
      />

      {/* MAIN CONTENT */}
      <div className="col-span-12 md:col-span-9">
        <h1 className="text-2xl font-bold mb-6">Manage My Account</h1>

        {activeTab === "profile" && (
          <>
            <ProfileView profile={profile} setActiveTab={setActiveTab} />
          </>
        )}

        {activeTab === "editProfile" && (
          <ProfileEdit
            profile={profile}
            setProfile={setProfile}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "orders" && <Orders />}
      </div>
    </div>
  );
}
