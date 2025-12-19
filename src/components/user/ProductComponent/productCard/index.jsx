import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCartActions } from "@/hooks/cart/useCart";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/Redux/authSlice/authSlice";
import LoadingSpot from "@/components/ui/spinner/loadingSpiner";

const ProductCard = ({ product }) => {
  const isAuth = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  // call api cart
  const { addCartApi,cartLoading } = useCartActions();
  if (!product) return null;

  const { name, images, price, description, id } = product;

  const longDescription =
    description || "This product features premium quality materials.";

  const handleCart = async (val) => {
    console.log(val)
    if (!isAuth) return navigate("/login");
    await addCartApi({}, `/cart/create/${id}`);
    if(val==="buyNow"){
      navigate("/checkout");
    }
  };

  return (
    <Card className="relative group group/image w-full rounded-xl overflow-hidden border shadow p-0 gap-2">
      <NavLink to={`/product/${id}`} className="block">
        {/* Icons Right Side */}
        <div className="absolute right-2 top-2 flex flex-col z-20">
          {/* <button className="p-1 mb-2 bg-white rounded-full shadow hover:bg-gray-100 transition cursor-pointer">
            <Heart size={18} />
          </button> */}

          <button className="p-1 bg-white rounded-full shadow hover:bg-gray-100 transition cursor-pointer">
            <Eye size={18} />
          </button>
        </div>

        <CardContent className="p-0 relative group/image bg-[#cfcdcd]">
          <div className="h-58">
            <img
              src={images?.[0]?.url}
              alt={name}
              className="w-full h-full object-contain"
            />
          </div>

          <div
            className="
            absolute bottom-0 left-0 w-full  text-white bg-black hover:bg-[#1d1b1b]
            opacity-0
            group-hover/image:opacity-100
            transition-opacity duration-300 ease-in
          "
          >
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleCart("buyNow");
              }}
              className="flex items-center justify-center gap-2 w-full bg-transparent hover:bg-transparent cursor-pointer"
              disabled={cartLoading}
            >
              <ShoppingCart size={18} />
              Buy Now
            </Button>
          </div>
        </CardContent>

        {/* PRODUCT TEXT */}
        <div className="px-3 pb-4">
          <h3 className="font-medium text-xl line-clamp-1 mt-2">{name}</h3>

          <p className="text-gray-600 text-sm line-clamp-2 mt-1">
            {longDescription}
          </p>

          <div className="flex items-center justify-between mt-3">
            {/* Price */}
            <p className="text-red-500 font-medium text-base">${price}</p>

            {/* CART BUTTON WITH TOOLTIP */}
            <div
              onClick={(e) => {
                e.preventDefault();
                handleCart(id);
              }}
              className="relative p-2 bg-white rounded-md shadow-lg hover:bg-gray-100 transition group/cart"
              disabled={cartLoading}
            >
              {/* Tooltip */}
              <span
                className="
                absolute -top-7 left-0 -translate-x-1/2 
                bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow
                opacity-0 pointer-events-none
                group-hover/cart:opacity-100
                transition-opacity duration-300
                whitespace-nowrap
              "
              >
                {cartLoading?<LoadingSpot text="Sending..." className="pt-0 text-white"/>:"Add to Cart"}
              </span>

              <ShoppingCart size={17} />
            </div>
          </div>
        </div>
      </NavLink>
    </Card>
  );
};

export default ProductCard;
