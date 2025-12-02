import { useApiResponse } from "@/hooks/ResponseApiHook";
import {
  addToCart,
  decrementQuantity,
  removeCart,
  removeSelectedItems,
  setCart,
} from "@/Redux/cartSlice/cartSlice";

export const useCartActions = () => {
  // Fetch cart
  const { fetchApi: fetchCart } = useApiResponse({
    endpoint: "/cart/getcart",
    method: "get",
    isToast: false,
    reduxAction: setCart,
  });

  // Increment
  const { fetchApi: incrementApi } = useApiResponse({
    method: "post",
    isToast: true,
    reduxAction: addToCart,
  });

  const handleIncrement = (id) =>
    incrementApi({}, `/cart/create/${id}`);

  // Decrement
  const { fetchApi: decrementApi } = useApiResponse({
    method: "delete",
    isToast: true,
    reduxAction: decrementQuantity,
  });

  const handleDecrement = (id) =>
    decrementApi({}, `/cart/removefromcartItemQuantity/${id}`);

  // Remove single item
  const { fetchApi: removeSingleCartApi } = useApiResponse({
    method: "delete",
    isToast: true,
    reduxAction: removeCart,
  });

  const handleRemove = (id) =>
    removeSingleCartApi({}, `/cart/removefromcart/${id}`);

  // Remove selected items
  const { fetchApi: removeSelectedApi } = useApiResponse({
    method: "delete",
    isToast: true,
    reduxAction: removeSelectedItems,
  });

  const handleRemoveSelected = (selectedIds, resetSelected) => {
    if (selectedIds.length === 0) return;

    removeSelectedApi(
      {},
      `/cart/removecart`,
      { itemIds: selectedIds }
    );

    resetSelected(); 
  };

  return {
    fetchCart,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleRemoveSelected,
  };
};
