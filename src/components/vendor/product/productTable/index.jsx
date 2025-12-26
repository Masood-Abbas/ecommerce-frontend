import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductTable({ products, toggleStatus, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-6 py-3 text-left">Product</th>
            <th className="px-6 py-3 text-left">Category</th>
            <th className="px-6 py-3 text-left">Price</th>
            <th className="px-6 py-3 text-left">Stock</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 flex gap-3">
                <img src={product.image} className="w-12 h-12 rounded-lg" />
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-slate-500">{product.description}</p>
                </div>
              </td>
              <td className="px-6 py-4">{product.category}</td>
              <td className="px-6 py-4 font-medium">${product.price}</td>
              <td className="px-6 py-4">{product.stock}</td>
              <td className="px-6 py-4 flex items-center gap-2">
                <Switch
                  checked={product.status}
                  onCheckedChange={() => toggleStatus(product.id)}
                />
                {product.status ? "Active" : "Inactive"}
              </td>
              <td className="px-6 py-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(product)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => onDelete(product)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
