import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Heart, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import ProductCard from "@/components/user/productCard";

const ProductDetail = () => {
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    fetchApi,
    loading,
    error,
    data: product,
  } = useApiResponse({
    endpoint: `/product/getsingleproduct/${id}`,
    method: "get",
    isToast: false,
  });
  console.log("product", product?.category?.products);
  useEffect(() => {
    fetchApi();
  }, [id]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  if (loading)
    return (
      <div className="w-full text-center py-20 text-xl font-semibold animate-pulse">
        Loading product...
      </div>
    );

  if (error)
    return (
      <div className="w-full text-center py-20 text-red-600 text-xl">
        Failed to fetch product!
      </div>
    );

  if (!product)
    return (
      <div className="w-full text-center py-20 text-xl">No product found.</div>
    );

  return (
    <div className="main-container p-6 ">
      <div className="flex flex-col lg:flex-row gap-10">
       {/* mobile  */}
        <div className="lg:hidden flex flex-col items-center gap-4 w-full">
          <Card className="rounded-3xl shadow-xl p-6 bg-[#d4d4d4] w-full">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-[350px] object-contain rounded-xl"
            />
          </Card>

          {/* Thumbnails mobile below main image */}
          <div className="flex gap-4 overflow-x-auto py-3">
            {product.images?.map((img) => (
              <img
                key={img.id}
                src={img.url}
                onClick={() => setSelectedImage(img.url)}
                className={`w-20 h-20 rounded-xl border cursor-pointer transition 
              ${
                selectedImage === img.url ? "border-black" : "border-gray-300"
              }`}
              />
            ))}
          </div>
        </div>

       {/* LEFT THUMBNAILS  */}
        <div className="hidden lg:flex flex-col gap-4">
          {product.images?.map((img) => (
            <img
              key={img.id}
              src={img.url}
              onClick={() => setSelectedImage(img.url)}
              className={`w-24 h-24 rounded-xl border cursor-pointer transition 
            ${selectedImage === img.url ? "border-black" : "border-gray-300"}`}
            />
          ))}
        </div>

        {/*MAIN IMAGE   */}
        <div className="hidden lg:flex flex-1">
          <Card className="rounded-3xl shadow-xl p-6 bg-[#d4d4d4] w-full flex justify-center">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-[450px] object-contain rounded-2xl"
            />
          </Card>
        </div>

        {/*  RIGHT SIDE PRODUCT DETAILS  */}
        <div className="flex-1 space-y-4">
          {/* Product Name */}
          <h1 className="text-2xl font-medium font-Inter text-black">
            {product.name}
          </h1>

          {/* in Stock */}
          <div>
            {product.stock > 3 ? (
              <span className="text-[#00FF66] text-sm font-medium">
                In Stock
              </span>
            ) : product.stock > 0 ? (
              <span className="text-yellow-500 text-sm font-medium">
                Low Stock
              </span>
            ) : (
              <span className="text-red-500 text-sm font-medium">
                Out of Stock
              </span>
            )}
          </div>
          {/* Price */}
          <p className="text-2xl font-Inter ">${product.price}</p>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed text-sm">
            {product.description}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => qty > 1 && setQty(qty - 1)}
              className="rounded-full w-10 h-10"
            >
              <Minus size={16} />
            </Button>

            <span className="text-xl font-semibold w-8 text-center">{qty}</span>

            <Button
              variant="outline"
              onClick={() => setQty(qty + 1)}
              className="rounded-full w-10 h-10"
            >
              <Plus size={16} />
            </Button>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6 items-center">
            <Button className="flex-1 bg-orange-500 text-white py-6 rounded-2xl text-lg flex gap-2 items-center">
              <ShoppingCart size={20} />
              Add to Cart
            </Button>

            <Button className="flex-1 bg-black text-white py-6 rounded-2xl text-lg">
              Buy Now
            </Button>

            <Button
              variant="outline"
              className="rounded-full w-14 h-14 flex items-center justify-center"
            >
              <Heart size={22} />
            </Button>
          </div>

          {/* Delivery Info */}
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
      </div>
      {/* Related product */}
      <section className="mt-14 mb-8">
        <div className="mb-6">
          {/* Top Label */}
          <div className="flex items-center gap-2 ">
            <span className="w-3  h-6 bg-[#DB4444] rounded-[3px]"></span>
            <span className="text-base font-semibold font-Inter text-[#DB4444]">
              Related Product
            </span>
          </div>
        </div>

        <div className="flex flex-wrap sm:gap-x-6 md:gap-x-15 lg:gap-x-8 gap-y-4 ">
          {product?.category?.products.map((p) => (
            <div
              key={p._id}
              className="w-full sm:w-[45%] lg:w-[23%] transition-all duration-500 ease-in-out opacity-0 animate-fadeIn"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
