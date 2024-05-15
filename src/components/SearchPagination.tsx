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
  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;
  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <>
            <PaginationItem>
              <PaginationPrevious page={previousPage} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink page={previousPage}>
                {previousPage}
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
              <PaginationLink page={nextPage}>{nextPage}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext page={nextPage} />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}
