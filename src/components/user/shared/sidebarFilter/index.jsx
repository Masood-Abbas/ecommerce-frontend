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
    <div className="sticky top-24 h-fit w-full p-4 bg-white rounded-lg shadow-md">
      <h3 className="font-semibold text-xl mb-4">Filter By:</h3>

      <Accordion
        type="single"
        collapsible
        value={openSection} 
        onValueChange={(value) => setOpenSection(value)}
        className="space-y-4"
      >

        {/* CATEGORY FILTER */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-base font-medium">Categories</AccordionTrigger>
          <AccordionContent className="pt-2">
            <ul className="flex flex-col gap-2">
              {categories?.map((cat) => (
                <li key={cat.id}>
                  <Button
                    variant={Number(selectedCategory) === Number(cat.id) ? "default bg-(--primary-color):" : "outline"}
                    className={`w-full justify-start text-sm ${
                      Number(selectedCategory) === Number(cat.id)
                        ? "bg-(--primary-color) text-white"
                        : ""
                    }`}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    {cat.name}
                  </Button>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* PRICE FILTER */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-medium">Price</AccordionTrigger>
          <AccordionContent className="pt-2 space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span>Rs. {filters.minPrice}</span>
              <span>Rs. {filters.maxPrice}</span>
            </div>

            <Slider
              min={0}
              max={filters.maxLimit}
              step={50}
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={([min, max]) =>
                setFilters({
                  ...filters,
                  minPrice: min,
                  maxPrice: max,
                })
              }
            />

            <Button className="w-full" onClick={applyFilters}>
              Apply Filters
            </Button>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
};

export default FilterSidebar;
