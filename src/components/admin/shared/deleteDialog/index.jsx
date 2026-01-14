import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useApiResponse } from "@/hooks/ResponseApiHook";


export default function DeleteDialog({
  open,
  setOpen,
  url,
  onDeleted,
}) {
  const { fetchApi, loading } = useApiResponse({ method: "delete" });

  const handleDelete = async () => {
    const res = await fetchApi({}, url);
    if (res?.data?.success) {
      onDeleted();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600">
          Are you sure? This action cannot be undone.
        </p>

        <DialogFooter>
          <Button variant="outline"  onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive"  onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
