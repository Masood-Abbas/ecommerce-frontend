import { Button } from "@/components/ui/button";
import LoadingSpot from "@/components/ui/spinner/loadingSpiner";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function TopProducts({url}) {
  const shopData = useSelector((state) => state.shop.shopData);
  const shopId = shopData?.id;
  // navigate 
  const navigate=useNavigate()
  const { fetchApi, data, loading } = useApiResponse({
    endpoint:  url ? url : shopId ? `/shop/${shopId}/products` : null,
    method: "get",
  });

  useEffect(() => {
    if (url || shopId) fetchApi();
  }, [shopId]);

  const products = data?.products || [];

  const handleView=()=>{
    navigate("/vendor/products")
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="flex justify-between px-6 py-4 border-b">
        <div>
          <h2 className="text-lg font-semibold">Top Products</h2>
          <p className="text-sm text-slate-500">Best  items</p>
        </div>
        <Button className="bg-(--primary-color) hover:bg-(--hover-primary-color) font-medium cursor-pointer" onClick={handleView}>
          View All
        </Button>
      </div>

      {loading && (
        <LoadingSpot text="loading Product"/>
      )}

      {!loading && products.length === 0 && (
        <p className="p-6 text-center text-slate-500">No products found</p>
      )}

      {!loading && products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm cursor-default">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 text-left">PRODUCT</th>
                <th className="px-6 py-3 text-left">CATEGORY</th>
                <th className="px-6 py-3 text-left">PRICE</th>
                <th className="px-6 py-3 text-left">STOCK</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <img
                      src={product?.images?.[0]?.url || "/placeholder.png"}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover "
                    />
                    <span className="line-clamp-2">{product.name}</span>
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {product?.category?.name || "-"}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    ${product.price}
                  </td>

                  <td className="px-6 py-4">
                    {product.stock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
