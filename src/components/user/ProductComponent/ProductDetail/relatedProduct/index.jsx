import ProductCard from "@/components/user/ProductComponent/productCard";

const RelatedProducts = ({ products }) => {
  if (!products?.length) return null;

  return (
    <section className="mt-14 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-3 h-6 bg-[#DB4444] rounded"></span>
        <span className="font-semibold text-[#DB4444]">Related Product</span>
      </div>

      <div className="flex flex-wrap gap-6">
        {products.map((p) => (
          <div key={p.id} className="w-full sm:w-[45%] lg:w-[23%]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
