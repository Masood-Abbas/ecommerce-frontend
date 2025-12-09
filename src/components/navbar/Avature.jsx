import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { logout } from "../../Redux/authSlice/authSlice";
import { Button } from "@/components/ui/button";

const AvatarMenu = () => {
  const [open, setOpen] = useState(false);
  const [logoutPopup, setLogoutPopup] = useState(false);
  const timeoutRef = useRef(null); // to store the timeout

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogoutConfirm = () => {
    setLogoutPopup(false);
    dispatch(logout());
    navigate("/login");
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current); 
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 200); 
  };

  return (
    <>
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Avatar Icon */}
        <User size={22} className="text-gray-700 cursor-pointer" />

        {/* Dropdown */}
        {open && (
          <div
            className={`absolute right-0 top-7 bg-white shadow-md border rounded-md ${
              user ? "w-60" : "w-60"
            } py-4 px-2 z-50`}
          >
            {user ? (
              <>
                <p className="text-base px-4 py-2 text-gray-700 font-medium border-b cursor-default">
                  {user.name || "User"}
                </p>

                <Button
                  variant="ghost"
                  className="w-full text-base justify-start cursor-pointer mt-2"
                  onClick={() => navigate("/profile")}
                >
                  My Account
                </Button>

                <Button
                  variant="destructive"
                  className="w-full justify-center mt-2"
                  onClick={() => setLogoutPopup(true)}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex w-full gap-4">
                <Button
                  variant="outline"
                  className="flex-1 bg-green-600 text-white hover:bg-green-500 hover:text-white transition-transform active:scale-95"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  className="flex-1 bg-green-600 text-white hover:bg-green-500 transition-transform active:scale-95"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logout Confirmation Popup */}
      {logoutPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-80 shadow-lg text-center">
            <p className="text-lg font-semibold">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-center gap-4 mt-5">
              <Button variant="outline" onClick={() => setLogoutPopup(false)}>
                Cancel
              </Button>

              <Button variant="destructive" onClick={handleLogoutConfirm}>
                Yes, Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AvatarMenu;
