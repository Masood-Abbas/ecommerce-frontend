import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { logout } from "../../Redux/authSlice/authSlice";
import { Button } from "@/components/ui/button";

const AvatarMenu = () => {
  const [open, setOpen] = useState(false);
  const [logoutPopup, setLogoutPopup] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );

  const timeoutRef = useRef(null);
  const menuRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // 🔥 FIX: Screen Resize ko detect karo
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleResize = (e) => {
      setIsDesktop(e.matches);
      setOpen(false); // screen change par menu band ho jaye
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // Desktop Hover - Open
  const handleMouseEnter = () => {
    if (!isDesktop) return;
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  // Desktop Hover - Close with delay
  const handleMouseLeave = () => {
    if (!isDesktop) return;
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  // Mobile Click toggle
  const handleClick = () => {
    if (isDesktop) return;
    setOpen((prev) => !prev);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleLogoutConfirm = () => {
    setLogoutPopup(false);
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <div
        ref={menuRef}
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Avatar Icon */}
        <User
          size={22}
          className={`text-gray-700 ${!isDesktop ? "cursor-pointer" : ""}`}
          onClick={handleClick}
        />

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-8 bg-white shadow-md border rounded-md w-60 py-4 px-2 z-50">
            {isAuthenticated ? (
              <>
                <p className="text-base px-4 py-2 text-gray-700 font-medium border-b">
                  {user.name || "User"}
                </p>

                <Button
                  variant="ghost"
                  className="w-full text-base justify-start mt-2"
                  onClick={() => {
                    navigate("/profile?tab=profile");
                    setOpen(false);
                  }}
                >
                  My Account
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-base justify-start mt-2"
                  onClick={() => {
                    navigate("/profile?tab=orders&page=1&limit=10");
                    setOpen(false);
                  }}
                >
                  My Orders
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
                  className="flex-1 bg-green-600 text-white"
                  onClick={() => {
                    navigate("/login");
                    setOpen(false);
                  }}
                >
                  Login
                </Button>

                <Button
                  variant="default"
                  className="flex-1 bg-green-600 text-white"
                  onClick={() => {
                    navigate("/signup");
                    setOpen(false);
                  }}
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
