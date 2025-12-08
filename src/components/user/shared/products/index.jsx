// src/components/products/ProductList.jsx
import ProductCard from "@/components/user/productCard";

const ProductList = ({ products }) => {
  
  if (!products.length)
    return <p className="text-gray-500">No products found.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductList;
