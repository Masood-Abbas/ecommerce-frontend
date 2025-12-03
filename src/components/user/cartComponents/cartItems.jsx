import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

export default function CartItems({
  items,
  selectedIds,
  toggleSelect,
  handleIncrement,
  handleDecrement,
  handleRemove,
  handleRemoveSelected,
  setSelectedIds,
}) {
  const scrollRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScrol=()=>{

  }
  return (
    <div className="lg:col-span-2 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-lg font-medium text-gray-700">
          {items.length} item{items.length > 1 ? "s" : ""} in your cart
        </p>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => {
              if (selectedIds.length === items.length) {
                setSelectedIds([]);
              } else {
                setSelectedIds(items.map((item) => item.id));
              }
            }}
          >
            {selectedIds.length === items.length ? "Deselect All" : "Select All"}
          </Button>

          <Button
            variant="destructive"
            className="rounded-xl"
            disabled={selectedIds.length === 0}
            onClick={() => handleRemoveSelected(selectedIds, () => setSelectedIds([]))}
          >
            Clear Cart
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="rounded-xl shadow-sm border border-gray-100 p-0">
        <div
          ref={scrollRef}
          className="overflow-x-auto md:overflow-visible select-none cursor-grab md:cursor-default"
          onClick={handleScrol}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          style={{ WebkitOverflowScrolling: "touch", overscrollBehaviorX: "contain" }}
        >
          <div className="max-md:min-w-[750px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-8 rounded-tl-xl"></TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Price</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-center">Subtotal</TableHead>
                  <TableHead className="text-center rounded-tr-xl">Remove</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 h-4"
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-4">
                        <img
                          src={item?.product?.images?.[0]?.url}
                          className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border"
                        />
                        <p className="font-semibold">{item.product.name}</p>
                      </div>
                    </TableCell>

                    <TableCell className="text-center font-semibold">
                      ${item.product.price}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-md h-8 w-8 hover:scale-110"
                          onClick={() => handleDecrement(item.productId)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>

                        <span className="text-lg font-semibold w-6 text-center">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-md h-8 w-8 hover:scale-110"
                          onClick={() => handleIncrement(item.productId)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell className="text-center font-bold">
                      ${(item.quantity * item.product.price).toFixed(2)}
                    </TableCell>

                    <TableCell className="text-center">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="rounded-md h-8 w-8 hover:scale-110"
                        onClick={() => handleRemove(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}
