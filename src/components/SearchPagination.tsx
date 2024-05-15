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
  pagination: { currentPage: number; maxNumPages: number };
};
export default function SearchPagination({
  pagination: { currentPage, maxNumPages },
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
        {currentPage < maxNumPages && (
          <>
            <PaginationItem>
              <PaginationLink page={nextPage}>{nextPage}</PaginationLink>
            </PaginationItem>
            {nextPage < maxNumPages && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext page={nextPage} />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}
