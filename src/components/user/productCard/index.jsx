import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { addToCart } from "@/Redux/cartSlice/cartSlice";
import { useCartActions } from "@/hooks/cart/useCart";

const ProductCard = ({ product }) => {
  const { addCartApi } = useCartActions();
  if (!product) return null;

  const { name, image, price, description, id } = product;

  const longDescription =
    description || "This product features premium quality materials.";


  const handleCart = async () => {
    await addCartApi({},`/cart/create/${id}`);
  };

  return (
    <Card className="w-full rounded-xl overflow-hidden border p-0 relative shadow-lg hover:shadow-[0_0_7px_rgba(0,0,0,0.15)] gap-2">
      <div className="absolute right-2 top-2 flex flex-col z-20">
        <button className="p-1 mb-3 bg-white rounded-md shadow-[0_0_7px_rgba(0,0,0,0.15)] hover:bg-gray-100 transition">
          <Heart size={18} />
        </button>
        <button className="p-1 bg-white rounded-md shadow-[0_0_7px_rgba(0,0,0,0.15)] hover:bg-gray-100 transition">
          <Eye size={18} />
        </button>
      </div>

      <CardContent className="p-0">
        <NavLink to={`/product/${id}`}>
          <img
            src={image ? import.meta.env.VITE_API_BASE_URL + image : image}
            alt={name}
            loading="lazy"
            className="w-full h-64 object-cover"
          />
        </NavLink>
      </CardContent>

      <div className="px-3 pb-4">
        <h3 className="font-semibold text-xl line-clamp-1 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {longDescription}
        </p>

        <div className="flex items-center justify-between mt-6">
          <p className="text-red-500 font-semibold text-lg">${price}</p>

          <NavLink
            onClick={(e) => {
              e.preventDefault();
              handleCart(id);
            }}
            className="relative group p-2 bg-white rounded-md shadow-[0_0_10px_rgba(0,0,0,0.20)] transition"
          >
            <span className="absolute -top-7 left-0 -translate-x-1/2 bg-gray-600 text-white text-xs px-2 py-1 rounded-lg shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Add to Cart
            </span>
            <ShoppingCart size={18} />
          </NavLink>
        </div>

        <div className="mt-6">
          <NavLink to={`/checkout/${id}`}>
            <Button className="w-full rounded-2xl font-semibold bg-blue-600 text-white shadow-md hover:bg-blue-700">
              Buy Now
            </Button>
          </NavLink>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
