import { LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard({
  to = "/",
  size = 20,
  className = "",
}) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      title="Go to Dashboard"
      className={`p-2 rounded-full hover:bg-slate-100 transition ${className} cursor-pointer`}
    >
      <LayoutDashboard size={size} />
    </button>
  );
}
