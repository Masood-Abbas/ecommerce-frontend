import { navHeading } from "@/utils/static/Navdata";
import { NavLink } from "react-router-dom";

const NavHeading = () => {
  return (
    <div className="flex justify-center gap-2 p-2  items-center bg-blue-500  ">
      {navHeading.map((data, index) =>
        index === 1 ? (
          <NavLink
            key={index}
            to="/shop"
            className=" text-white  py-1 rounded-md font-semibold  transition-all duration-300 hover:text-blue-900"
          >
            {data}
          </NavLink>
        ) : (
          <span
            key={index}
            className="text-white font-semibold cursor-default py-1 rounded-md"
          >
            {data}
          </span>
        )
      )}
    </div>
  );
};

export default NavHeading;
