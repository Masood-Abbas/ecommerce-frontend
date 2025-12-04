import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApiResponse } from "@/hooks/ResponseApiHook";

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
  // Related products
  // const {
  //   fetchApi: fetchRelated,
  //   loading: relatedLoading,
  //   data: relatedProducts,
  // } = useApiResponse({
  //   method: "get",
  //   isToast: false,
  // });

  // console.log("relatedProducts",relatedProducts)
  useEffect(() => {
    fetchApi();
  }, [id]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  console.log("product",product)

// useEffect(() => {
//   if (product?.categoryId) {
//     fetchRelated({},`/category/getsinglecategory/${product.categoryId}`);
//   }
// }, [product]);

  if (loading)
    return <div className="w-full text-center py-20 text-xl font-semibold animate-pulse">Loading product...</div>;
  if (error)
    return <div className="w-full text-center py-20 text-red-600 text-xl">Failed to fetch product!</div>;
  if (!product)
    return <div className="w-full text-center py-20 text-xl">No product found.</div>;

  return (
    <div className="main-container p-6 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Left Section */}
      <div className="space-y-4">
        <Card className="rounded-3xl shadow-lg p-6 flex items-center justify-center bg-white md:h-[600px]">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-full object-cover rounded-2xl transition-transform duration-500 ease-out hover:scale-102"
          />
        </Card>

        <div className="flex gap-3 mt-3">
          {product.images?.slice(0, 3).map((img) => (
            <img
              key={img.id}
              src={img.url}
              onClick={() => setSelectedImage(img.url)}
              className={`w-20 h-20 object-cover rounded-xl border-2 cursor-pointer transition ${
                selectedImage === img.url ? "border-blue-500" : "border-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Detail Section */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold leading-tight text-gray-800">{product.name}</h1>
        <p className="text-4xl font-bold text-black tracking-tight">{product.price} $</p>

        <Card className="border rounded-3xl p-5 shadow-md bg-gray-50 sm:w-[70%]">
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <p className="flex items-center gap-2 cursor-pointer">
              <span className={`font-semibold text-white px-2 py-1 rounded ${product.stock >= 3 ? "bg-green-500" : "bg-red-500"}`}>Stock</span>
              <span className="font-semibold">:</span>
              <span className={`font-semibold ${product.stock < 3 ? "text-red-500" : "text-gray-800"}`}>
                {product.stock > 0 ? product.stock : "No stock available"}
              </span>
            </p>

            <p className="flex items-center gap-2 cursor-pointer">
              <span className="font-semibold text-white bg-blue-600 px-2 py-1 rounded">Category</span>
              <span className="font-semibold">:</span>
              <span className="font-semibold">{product.category?.name}</span>
            </p>

            <p className="flex items-center gap-2 cursor-pointer">
              <span className="font-semibold text-white bg-yellow-400 px-2 py-1 rounded">Shop</span>
              <span className="font-semibold">:</span>
              <span className="font-semibold">{product.shop?.name}</span>
            </p>
          </div>
        </Card>

        {/* Quantity */}
        <div className="flex items-center space-x-4 mt-4">
          <Button variant="outline" onClick={() => qty > 1 && setQty(qty - 1)} className="rounded-full w-10 h-10 flex items-center justify-center">
            <Minus size={16} />
          </Button>
          <span className="text-2xl font-semibold w-10 text-center">{qty}</span>
          <Button variant="outline" onClick={() => setQty(qty + 1)} className="rounded-full w-10 h-10 flex items-center justify-center">
            <Plus size={16} />
          </Button>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <Button className="flex-1 rounded-2xl text-lg py-6 shadow-md hover:shadow-lg transition-all bg-orange-500 hover:bg-orange-600 text-white">
            <ShoppingCart size={20} /> Add to Basket
          </Button>
          <Button variant="secondary" className="flex-1 rounded-2xl text-lg py-6 shadow-md hover:shadow-lg transition-all">
            Buy Now
          </Button>
        </div>

        {/* Description */}
        <Card className="mt-8 p-6 rounded-3xl shadow-md bg-white gap-2">
          <h2 className="font-semibold text-xl mb-3 text-gray-800">Description</h2>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
        </Card>

        {/* Related Products */}
        {/* {relatedProducts?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((item) => (
                <Card key={item.id} className="rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-lg transition">
                  <img src={item.images[0]?.url} alt={item.name} className="w-full h-40 object-cover rounded-xl mb-3" />
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-700 font-bold">{item.price} $</p>
                  <Button className="w-full mt-2 bg-blue-500 text-white hover:bg-blue-600">View</Button>
                </Card>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ProductDetail;
