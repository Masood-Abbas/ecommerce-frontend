import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, ShoppingCart } from "lucide-react";


const ProductDetailInfo = ({
  product,
  quantity,
  setQuantity,
  handleCartData,
  cartLoading,
}) => {

  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-2xl font-medium">{product.name}</h1>

      {/* Stock */}
      {product.stock > 5 ? (
        <span className="text-green-500 text-sm">In Stock</span>
      ) : (
        <span className="text-red-500 text-sm">Out of Stock</span>
      )}

      <p className="text-2xl">${product.price}</p>
      <p className="text-gray-600 text-sm">{product.description}</p>

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          className="rounded-full w-10 h-10"
        >
          <Minus size={16} />
        </Button>

        <span className="text-xl font-semibold">{quantity}</span>

        <Button
          variant="outline"
          onClick={() => setQuantity(quantity + 1)}
          className="rounded-full w-10 h-10"
        >
          <Plus size={16} />
        </Button>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <Button
          className="flex-1 bg-white text-black py-6 rounded-lg border text-lg flex gap-2 items-center hover:bg-gray-200 "
          onClick={() => handleCartData(product.id)}
          disabled={ product.stock <= 5||cartLoading }
        >
          <ShoppingCart size={20} />
          Add to Cart
        </Button>

        <Button
          className="flex-1 bg-(--primary-color) hover:bg-(--hover-primary-color) text-white py-6 rounded-lg text-lg"
          onClick={() => handleCartData(product.id, "buyNow")}
          disabled={ product.stock <= 5||cartLoading }
        >
          Buy Now
        </Button>
      </div>

      {/* Delivery */}
      <Card className="p-5 mt-6 rounded-3xl shadow-md">
        <div className="flex items-center gap-4 border-b pb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/679/679922.png"
            className="w-10"
          />
          <div>
            <h3 className="font-semibold">Free Delivery</h3>
            <p className="text-xs text-gray-600">
              Enter your postal code for delivery availability
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/850/850960.png"
            className="w-10"
          />
          <div>
            <h3 className="font-semibold">Return Delivery</h3>
            <p className="text-xs text-gray-600">
              Free 30 days delivery returns
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetailInfo;
