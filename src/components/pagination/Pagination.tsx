import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}) => {
  const getPageNumbers = (): number[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const start = Math.max( 1, Math.min(currentPage - 2, totalPages - maxVisiblePages + 1));
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className={styles.pageButton}
      >
        Prev
      </button>

      <div className={styles.pageNumbers}>
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`${styles.pageNumber} ${
              currentPage === pageNum ? styles.activePage : ""
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={styles.pageButton}
      >
        Next
      </button>
    </div>
  );
};
