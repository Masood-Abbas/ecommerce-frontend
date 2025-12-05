import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";

const NavLinks = ({ links, onClick }) => {
  const navigate = useNavigate();
  const { items: categories } = useSelector((state) => state.categories);


  const linkClass = ({ isActive }) =>
    `hover:text-black ${
      isActive
        ? "text-black font-semibold underline"
        : "text-black text-base font-normal"
    }`;

  return (
    <>
      {links.map((link) => {
        if (link.name.toLowerCase() === "category") {
          return (
            <div key={link.name} className="relative group">
              <NavLink to={link.path} className={linkClass} onClick={onClick}>
                {link.name}
              </NavLink>

              {/* Dropdown */}
              <div className="hidden md:block absolute left-0 top-full mt-2 p-2 w-48 bg-white not-[]:shadow-lg rounded-md opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 z-50 border">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    onClick={() => navigate(`/category/${cat.id}?page=1&limit=10`)}
                    className="block w-full text-left px-4 py-2 bg-transparent hover:bg-gray-100 text-black font-normal"
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>

              {/* mobile */}
              <div className="flex flex-col md:hidden ">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    onClick={() => navigate(`/category/${cat.id}?page=1&limit=10`)}
                    className="block w-full text-left px-4 py-2 bg-transparent hover:bg-gray-100 text-black font-normal"
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>
          );
        }

        return (
          <NavLink
            key={link.name}
            to={link.path}
            className={linkClass}
            onClick={onClick}
          >
            {link.name}
          </NavLink>
        );
      })}
    </>
  );
};

export default NavLinks;
