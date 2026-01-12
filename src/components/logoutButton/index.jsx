import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import LogoutPopup from "../user/popup/LogoutPopUp";


export default function LogoutButton({
  className = "",
  fullWidth = true,
}) {
  const [open, setOpen] = useState(false);
  const logoutUser = useLogout();

  const handleConfirm = () => {
    console.log("logout")
    setOpen(false);
    logoutUser();
  };

  const handleClick=()=>{
    setOpen(true)
  }
  return (
    <>
      <Button
        onClick={handleClick}
        className={`gap-3 ${fullWidth ? "w-full" : ""} ${className}`}
      >
        <LogOut size={18} />
        Logout
      </Button>

      {open && (
        <LogoutPopup
          open={open}
          onCancel={() => setOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
