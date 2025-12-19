import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";

const FilterSidebar = ({
  categories,
  selectedCategory,
  handleCategorySelect,
  filters,
  setFilters,
  applyFilters,
  openSection,
  setOpenSection,
}) => {
  return (
    <div className="sticky top-24 h-fit w-full p-4 bg-white rounded-lg border border-border md:shadow-md">
      <h3 className="font-semibold text-xl mb-4">Filter By</h3>

      <Accordion
        type="single"
        collapsible
        value={openSection}
        onValueChange={setOpenSection}
        className="space-y-4"
      >
        {/* Category */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-base font-medium hover:no-underline">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories?.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.name ? "default" : "outline"}
                   className={`w-full justify-start text-sm ${
                      selectedCategory == cat.name
                        ? "bg-(--primary-color) hover:bg-(--hover-primary-color) text-white"
                        : ""
                    }`}
                  onClick={() => handleCategorySelect(cat)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-medium hover:no-underline">Price</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="flex justify-between text-sm font-medium ">
              <span>Rs. {filters.minPrice}</span>
              <span>Rs. {filters.maxPrice}</span>
            </div>

            <Slider
              min={0}
              max={filters.maxLimit}
              step={50}
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={([min, max]) =>
                setFilters({ ...filters, minPrice: min, maxPrice: max })
              }
              className="bg-(--primary-color)"
            />

            <Button className="w-full bg-(--primary-color) hover:bg-(--hover-primary-color)" onClick={applyFilters}>
              Apply Filters
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FilterSidebar;
