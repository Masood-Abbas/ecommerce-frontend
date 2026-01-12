import { MoreVertical, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ProductFormDialog from "../productForm";
import DeleteProductDialog from "../deleteDialog";

export default function ProductActions({ product, onRefresh }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem className="cursor-pointer" onClick={() => setEditOpen(true)}>
            <Pencil className="w-4 h-4 mr-2 " /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-(--primary-color) data-highlighted:text-red-600 cursor-pointer"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash className="w-4 h-4 mr-2 text-(--primary-color)" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProductFormDialog
        open={editOpen}
        setOpen={setEditOpen}
        mode="edit"
        product={product}
        onSuccess={onRefresh}
      />

      <DeleteProductDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        productId={product.id}
        onDeleted={onRefresh}
      />
    </>
  );
}
