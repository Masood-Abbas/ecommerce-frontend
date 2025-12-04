import { useApiResponse } from "@/hooks/ResponseApiHook";
import { useEffect } from "react";

const CategoryMenu = () => {
  const { fetchApi, data: categories } = useApiResponse({
    endpoint: "/category/getallcategory",
    method: "get",
  });

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <div className="w-56 bg-white   px-4  space-y-3">
      {Array.isArray(categories) &&
        categories.map((cat) => (
          <p key={cat.id} className="cursor-pointer text-base hover:text-black/70 ">
            {cat.name}
          </p>
        ))}
    </div>
  );
};

export default CategoryMenu;
