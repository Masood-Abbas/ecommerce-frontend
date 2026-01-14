import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import TableActions from "../../shared/TableAction";
// import DeleteDialog from "../../shared/deleteDialog";
import ProductStatusDialog from "../EditProductPopUp";



export default function ProductActions({ data, onRefresh }) {
  const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);

  const actions = [
    {
      label: "Edit",
      icon: Pencil,
      onClick: () => setEditOpen(true),
    },
    // {
    //   label: "Delete",
    //   icon: Trash,
    //   type:"danger"
    //   className: "text-red-600 hover:text-red-600",
    //   onClick: () => setDeleteOpen(true),
    // },
  ];

  return (
    <>
      <TableActions actions={actions} />

      <ProductStatusDialog
        open={editOpen}
        setOpen={setEditOpen}
        mode="edit"
        data={data}
        onSuccess={onRefresh}
      />

      {/* <DeleteDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        url={`/admin/deleteUser/${data.id}`}
        onDeleted={onRefresh}
      /> */}
    </>
  );
}
