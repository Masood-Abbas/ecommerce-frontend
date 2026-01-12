import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/Redux/authSlice/authSlice";


export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("logout")
    dispatch(logout());
    navigate("/login");
  };

  return handleLogout;
};
