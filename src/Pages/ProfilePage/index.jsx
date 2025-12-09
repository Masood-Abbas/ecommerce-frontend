import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import Orders from "@/components/user/profilecomponets/Orders";
import Sidebar from "@/components/user/profilecomponets/Sidebar";
import ProfileEdit from "@/components/user/profilecomponets/ProfileEdit";
import ProfileView from "@/components/user/profilecomponets/ProfileView";

export default function ProfilePage() {
  const data = useSelector((state) => state.auth.user);
  const { fetchApi } = useApiResponse({
    endpoint: `/user/getSingleUser/${data.id}`,
    method: "get",
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    Role: "",
    Password: "",
  });
  const handleFetch = async () => {
    const res = await fetchApi();
    const data = res.data.data;
    setProfile(data);
  };
  useEffect(() => {
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
