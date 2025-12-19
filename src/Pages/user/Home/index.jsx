import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import Slider from "../../../components/user/slider.jsx/index.jsx";
import ProductCard from "@/components/user/ProductComponent/productCard/index.jsx";
import { LiquidFeatureCard } from "@/components/user/featureCard/index.jsx";
import { Button } from "@/components/ui/button.jsx";

import { useApiResponse } from "@/hooks/ResponseApiHook/index.jsx";
import {
  setBestSellingProducts,
  appendAllProducts,
} from "@/Redux/producttSlice/productSlice.jsx";

import { features, slideData } from "@/utils/static/HomeData.jsx";
import CategoryMenu from "@/components/user/categoryMenu/index.jsx";
import { setCategories } from "@/Redux/categoriesSlice/categoriesSlice.jsx";
import Spinner from "@/components/ui/spinner/spiner.jsx";
import LoadingSpot from "@/components/ui/spinner/loadingSpiner.jsx";

const Home = () => {
  const [limit] = useState(4);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const effectRan = useRef(false);

  // Best Selling API
  const {
    loading: bestSellingLoading,
    error: bestSellingError,
    fetchApi: fetchBestSelling,
  } = useApiResponse({
    endpoint: "/product/get-top-best-selling-products",
    reduxAction: setBestSellingProducts,
  });

  // All Products API
  const {
    loading: allProductsLoading,
    error: allProductsError,
    fetchApi: fetchAllProducts,
  } = useApiResponse({
    endpoint: "/product/getallproducts",
    reduxAction: appendAllProducts,
  });

  // Load products function
  const loadProducts = async (currentPage) => {
    const res = await fetchAllProducts({ limit, page: currentPage });
    const newItems = res?.data?.data?.products || [];

    if (newItems.length < limit) setHasMore(false);
    return newItems;
  };

  // Initial fetch
  useEffect(() => {
    if (effectRan.current) return;
    fetchBestSelling();
    loadProducts(1);
    effectRan.current = true;
  }, []);

  // Handle Load More
  const handleLoadMore = async () => {
    if (!hasMore || loadingMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);

    await loadProducts(nextPage);

    setLoadingMore(false);
  };

  const { bestSellingProducts = [], allProducts = [] } = useSelector(
    (state) => state.products
  );

  return (
    <div className="main-container py-5">
      {/* Banner Slider */}
      {/* <div className=" pb-4 mb-8 flex">
        <div className="w-[20%] pt-8 border-r border-gray-300 ">
          <CategoryMenu />
        </div>
        <div className="w-full px-10 pt-8">
          <Slider slides={slideData} />
        </div>
      </div> */}
      <div className=" mb-8">
        <Slider slides={slideData} />
      </div>

      {/* Top Selling */}
      <section className="my-10">
        <div className="mb-6">
          {/* Top Label */}
          <div className="flex items-center gap-2 ">
            <span className="w-3 h-6 bg-[#DB4444] rounded-[3px]"></span>
            <span className="text-base font-semibold font-Intern text-[#DB4444]">
              This Month
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-samibold font-Inter my-3">
            Top Selling Products
          </h1>
        </div>

        {bestSellingLoading && <Spinner />}
        {bestSellingError && <p>Error loading best selling products</p>}

        <div className="flex flex-wrap justify-between gap-4">
          {bestSellingProducts.map((p) => (
            <div
              key={p.id}
              className="w-full sm:w-[45%] lg:w-[23%] transition-all duration-500 ease-in-out opacity-100"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* All Products */}
      <section className="my-10">
        <div className="mb-6">
          {/* Top Label */}
          <div className="flex items-center gap-2 ">
            <span className="w-3  h-6 bg-[#DB4444] rounded-[3px]"></span>
            <span className="text-base font-semibold font-Inter text-[#DB4444]">
              Our Product
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-samibold my-3">Explore Our Products</h1>
        </div>
        {allProductsLoading && page === 1 && <Spinner />}
        {allProductsError && <p>Error loading products</p>}

        <div className="flex flex-wrap sm:gap-6 md:gap-15 lg:gap-8 justify-center">
          {allProducts.map((p) => (
            <div
              key={p.id}
              className="w-full sm:w-[45%] lg:w-[23%] transition-all duration-500 ease-in-out opacity-0 animate-fadeIn"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-6 text-center">
            <Button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className={`px-6 py-3 bg-[#DB4444] text-white font-semibold rounded-lg shadow-md hover:bg-[#E07575] transition-all ${
                loadingMore ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loadingMore ? <LoadingSpot /> : "Load More"}
            </Button>
          </div>
        )}
      </section>

      {/* Features Section */}
      <div className="flex justify-center gap-12 py-12 bg-white">
        {features.map((feature, idx) => (
          <LiquidFeatureCard key={idx} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default Home;
