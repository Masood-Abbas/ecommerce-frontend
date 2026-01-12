// components/ui/LogoutPopup.jsx
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";

const LogoutPopup = ({ open, onCancel, onConfirm }) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black flex items-center justify-center z-9999 h-screen">
      <div className="bg-white p-6 rounded-md w-90 shadow-lg text-center">
        <p className="text-lg font-semibold">
          Are you sure you want to logout?
        </p>

        <div className="flex justify-center gap-4 mt-5">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <Button  onClick={onConfirm} className="bg-(--primary-color) hover:bg-(--hover-primary-color)">
            Yes, Logout
          </Button>
        </div>
      </div>
    </div>,
  document.body
  );
 
};

export default LogoutPopup;
