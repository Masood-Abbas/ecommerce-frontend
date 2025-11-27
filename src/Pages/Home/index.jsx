import { useEffect, useState } from "react";
import Slider from "../../components/user/slider.jsx";
import ProductCard from "@/components/user/productCard/index.jsx";
import { useApiResponse } from "@/hooks/ResponseApiHook/index.jsx";
import { LiquidFeatureCard } from "@/components/user/featureCard/index.jsx";
import { getJustifyClass } from "@/utils/layout/getJustifyClass.js";
import { Button } from "@/components/ui/button.jsx";
import { features, slideData } from "@/utils/static/HomeData.jsx";

const Home = () => {
  const [allVisibleCount, setAllVisibleCount] = useState(4);

  // Best Selling Products API
  const {
    data: bestSellingData,
    loading: bestSellingLoading,
    error: bestSellingError,
    fetchApi: bestSellingApi,
  } = useApiResponse({
    endpoint: "/product/get-top-best-selling-products",
    method: "GET",
    isToast: false,
  });

  const bestSellingProducts = bestSellingData?.data?.products || [];

  // All Products API

  const {
    data: getAllProduct,
    loading: getAllLoading,
    error: getAllError,
    fetchApi: getProductApi,
  } = useApiResponse({
    endpoint: "/product/getallproducts",
    method: "GET",
    isToast: false,
  });

  const allProducts = getAllProduct?.data?.products || [];

  // Fetch on Mount

  useEffect(() => {
    bestSellingApi();
    getProductApi();
  }, []);

  // Load More Products
  const handleLoadMore = () => {
    setAllVisibleCount((prev) => prev + 4);
  };

  const visibleProducts = allProducts.slice(0, allVisibleCount);

  return (
    <div className="main-container">
      {/* Slider Section */}
      <div className="mt-2 py-4 mb-8">
        <Slider slides={slideData} />
      </div>

      {/*Top Best Selling */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-6">Top Selling Products</h1>

        {bestSellingLoading && <p>Loading products...</p>}

        {bestSellingError && (
          <p className="text-red-500">
            Error loading products:
            {bestSellingError?.message || "Something went wrong"}
          </p>
        )}

        {Array.isArray(bestSellingProducts) &&
        bestSellingProducts.length > 0 ? (
          <div className="flex justify-between flex-wrap gap-4">
            {bestSellingProducts.map((product) => (
              <div key={product.id} className="w-full sm:w-[45%] lg:w-[23%]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-500">
            Error loading products:
            {bestSellingError?.message || "Something went wrong"}
          </p>
        )}
      </div>

      {/*All Products */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">All Products</h1>

        {getAllLoading && <p>Loading products...</p>}

        {Array.isArray(allProducts) && allProducts.length > 0 ? (
          <>
            <div
              className={`flex flex-wrap gap-4 ${getJustifyClass(
                visibleProducts.length
              )}`}
            >
              {visibleProducts.map((product) => (
                <div key={product.id} className="w-full sm:w-[45%] lg:w-[23%]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {allVisibleCount < allProducts.length && (
              <div className="mt-6 text-center">
                <Button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:scale-105"
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-red-500">
            Error loading products:
            {bestSellingError?.message || "Something went wrong"}
          </p>
        )}
      </div>

      {/*       Liquid Feature Section */}
      <div className="flex justify-center gap-12 py-12 bg-white">
        {features.map((feature, idx) => (
          <LiquidFeatureCard key={idx} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default Home;
