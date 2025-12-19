import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/Redux/authSlice/authSlice";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { useCartActions } from "@/hooks/cart/useCart";
import LoadingSpot from "@/components/ui/spinner/loadingSpiner";
import {
  ProductDetailInfo,
  ProductGallery,
  RelatedProducts,
} from "@/components/user/ProductComponent/ProductDetail";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuthenticated);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const { addCartApi, cartLoading } = useCartActions();

  const {
    fetchApi,
    loading,
    error,
    data: product,
  } = useApiResponse({
    endpoint: `/product/getsingleproduct/${id}`,
    method: "get",
  });

  useEffect(() => {
    fetchApi();
  }, [id]);

  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  const handleCartData = (id, type) => {
    if (!isAuth) return navigate("/login");
    addCartApi({}, `/cart/create/${id}`, { quantity });
    if (type === "buyNow") navigate("/checkout");
  };

  if (loading)
    return (
      <div className="min-h-screen">
        <LoadingSpot text="Fetch Product" />
      </div>
    );
  if (error) return <p>Error loading product</p>;
  if (!product) return <p>No product found</p>;

  return (
    <div className="main-container p-5">
      <div className="flex flex-col lg:flex-row gap-10">
        <ProductGallery
          images={product.images}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          altname={product.name}
        />

        <ProductDetailInfo
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
          handleCartData={handleCartData}
          cartLoading={cartLoading}
        />
      </div>

      <RelatedProducts products={product.category?.products} />
    </div>
  );
};

export default ProductDetail;
