import { NavLink } from "react-router-dom";

const NavLinks = ({ links, onClick }) => {
  const linkClass = ({ isActive }) =>
    `hover:text-black ${
      isActive ? "text-black font-semibold underline" : "text-gray-700"
    }`;

  return (
    <>
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={linkClass}
          onClick={onClick} 
        >
          {link.name}
        </NavLink>
      ))}
    </>
  );
};

export default NavLinks;
