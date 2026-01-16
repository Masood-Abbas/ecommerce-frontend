import { Button } from "@/components/ui/button";
import { User, Package, Store, X, Menu, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/utils/helperFunction/getInitialsName";
import LogoutButton from "@/components/logoutButton";

export default function Sidebar({
  activeTab,
  setActiveTab,
  profile,
  role = "user",
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabClick = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const MenuItem = ({ id, label, Icon }) => (
    <button
      onClick={() => handleTabClick(id)}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
        ${
          activeTab === id
            ? "bg-gray-100 text-(--primary-color) font-medium"
            : "text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Profile Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ">
            <AvatarFallback className="bg-(--primary-color) text-primary-foreground text-lg font-semibold">
              {getInitials(profile?.name || "M")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">
              {profile?.name || "User"}
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              {profile?.email || "Welcome to your dashboard"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <MenuItem id="profile" label="My Profile" Icon={User} />
        <MenuItem id="orders" label="My Orders" Icon={Package} />

        {role === "admin" && (
          <div className="space-y-2 w-full">
            <Button
              className="text-gray-600 bg-transparent hover:bg-gray-100 text-sm w-full flex justify-start overflow-hidden"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/admin/dashboard");
              }}
            >
              <Shield size={18} />
              <span>Go to admin dashboard</span>
            </Button>
          </div>
        )}

        {role === "vendor" && (
          <div className="space-y-2 w-full">
            <Button
              className="text-gray-600 bg-transparent hover:bg-gray-100 text-sm w-full flex justify-start overflow-hidden"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/vendor/dashboard");
              }}
            >
              <Store size={18} />
              <span>Go to vendor dashboard</span>
            </Button>
          </div>
        )}

        {role !== "admin" && role !== "vendor" && (
          <MenuItem id="seller" label="Become a Seller" Icon={Store} />
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <LogoutButton className="bg-(--primary-color) hover:bg-(--hover-primary-color) " />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="hidden fixed right-4 top-30 z-50 ">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen} className="">
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg bg-(--primary-color) hover:bg-(--hover-primary-color)"
            >
              <Menu size={24} />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-80 p-0">
            <SheetClose className="absolute right-4 top-4 z-10">
              <X size={20} className="text-muted-foreground" />
            </SheetClose>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block md:col-span-4 lg:col-span-3">
        <div className="sticky top-20 bg-card shadow-sm rounded-2xl border border-border overflow-hidden">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}
