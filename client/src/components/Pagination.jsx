const Pagination = ({ page, totalPages, onPrev, onNext }) => (
  <div className="pagination-row">
    <button onClick={onPrev} disabled={page <= 1}>
      Previous
    </button>
    <span>
      Page {page} / {totalPages || 1}
    </span>
    <button onClick={onNext} disabled={page >= totalPages}>
      Next
    </button>
  </div>
);

export default Pagination;
