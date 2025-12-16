


import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { logout, selectIsAuthenticated } from "../../Redux/authSlice/authSlice";
import { Button } from "@/components/ui/button";
import LogoutPopup from "../user/popup/LogoutPopUp";

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
  const { user } = useSelector((state) => state.auth);
  const isAuth = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleResize = (e) => {
      setIsDesktop(e.matches);
      setOpen(false);
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const handleMouseEnter = () => {
    if (!isDesktop) return;
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isDesktop) return;
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  const handleClick = () => {
    if (isDesktop) return;
    setOpen((prev) => !prev);
  };

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
        className="relative cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <User
          size={22}
          className={`text-gray-700 ${!isDesktop ? "cursor-pointer" : ""}`}
          onClick={handleClick}
        />

        {open && (
          <div className="absolute right-0 top-8 bg-white shadow-md border rounded-md w-60 py-4 px-2 z-50">
            {isAuth ? (
              <>
                <p className="text-base px-4 py-2 text-gray-700 font-medium border-b">
                  {user.name || "User"}
                </p>

                <Button
                  variant="ghost"
                  className="w-full text-base justify-start mt-2 cursor-pointer"
                  onClick={() => {
                    navigate("/profile?tab=profile");
                    setOpen(false);
                  }}
                >
                  My Account
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-base justify-start mt-2 cursor-pointer"
                  onClick={() => {
                    navigate("/profile?tab=orders&page=1&limit=10");
                    setOpen(false);
                  }}
                >
                  My Orders
                </Button>

                <Button
                  className="w-full justify-center mt-2 cursor-pointer bg-(--primary-color) hover:bg-(--hover-primary-color)"
                  onClick={() => setLogoutPopup(true)}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex w-full gap-4">
                <Button
                  variant="outline"
                  className="flex-1 bg-(--primary-color) hover:bg-(--hover-primary-color) text-white  hover:text-white cursor-pointer"
                  onClick={() => {
                    navigate("/login");
                    setOpen(false);
                  }}
                >
                  Login
                </Button>

                <Button
                  variant="default"
                  className="flex-1 bg-gray-200 hover:bg-gray-100 text-black cursor-pointer"
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

      {/*LogoutPopup  */}
      <LogoutPopup
        open={logoutPopup}
        onCancel={() => setLogoutPopup(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default AvatarMenu;
