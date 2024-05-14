import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
type _Props = {
  pagination: { currentPage: number; maxPages: number };
};
export default function SearchPagination({
  pagination: { currentPage, maxPages },
}: _Props) {
  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <>
            <PaginationItem>
              <PaginationPrevious page={currentPage - 1} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink page={currentPage - 1}>
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationLink page={currentPage} isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        {currentPage < maxPages && (
          <>
            <PaginationItem>
              <PaginationLink page={currentPage + 1}>
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext page={currentPage + 1} />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}
