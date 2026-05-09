type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, totalItems, pageSize, onPageChange }: PaginationProps) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <nav className="pagination" aria-label="待办分页">
      <span>
        第 {start}-{end} 条，共 {totalItems} 条
      </span>
      <div className="pagination__controls">
        <button
          className="icon-button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          type="button"
          aria-label="上一页"
          title="上一页"
        >
          ‹
        </button>
        <strong>
          {currentPage} / {totalPages}
        </strong>
        <button
          className="icon-button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          type="button"
          aria-label="下一页"
          title="下一页"
        >
          ›
        </button>
      </div>
    </nav>
  );
}
