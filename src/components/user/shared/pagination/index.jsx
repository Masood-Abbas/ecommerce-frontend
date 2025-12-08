// src/components/pagination/PaginationSection.jsx

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

const PaginationSection = ({ pagination, goToPage }) => {
  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() =>
              pagination.page > 1 && goToPage(pagination.page - 1)
            }
            className={
              pagination.page <= 1
                ? "opacity-50 pointer-events-none"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {Array.from({ length: pagination.totalPages }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => goToPage(i + 1)}
              isActive={pagination.page === i + 1}
              className="cursor-pointer"
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              pagination.page < pagination.totalPages &&
              goToPage(pagination.page + 1)
            }
            className={
              pagination.page >= pagination.totalPages
                ? "opacity-50 pointer-events-none"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationSection;
