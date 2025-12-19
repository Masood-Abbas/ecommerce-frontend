import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import FilterSidebar from "@/components/user/shared/sidebarFilter";

const ProductHeader = ({
  title,
  mobileFilterOpen,
  setMobileFilterOpen,
  categories,
  selectedCategory,
  filters,
  setFilters,
  applyFilters,
  openSection,
  setOpenSection,
  handleCategorySelect,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl md:text-3xl font-medium">
        {title}
      </h1>

      {/* Mobile Filter Button */}
      <div className="md:hidden">
        <Sheet
          open={mobileFilterOpen}
          onOpenChange={setMobileFilterOpen}
        >
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full flex gap-2"
            >
              <Menu size={16} /> Filters
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-80 p-0">
            <SheetClose className="absolute right-4 top-4">
              <X size={18} />
            </SheetClose>

            <div className="p-4">
              <FilterSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                filters={filters}
                setFilters={setFilters}
                applyFilters={() => {
                  applyFilters();
                  setMobileFilterOpen(false);
                }}
                openSection={openSection}
                setOpenSection={setOpenSection}
                handleCategorySelect={(cat) => {
                  handleCategorySelect(cat);
                  setMobileFilterOpen(false);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ProductHeader;
