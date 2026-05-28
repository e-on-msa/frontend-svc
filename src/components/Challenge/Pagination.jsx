const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // 페이지 배열 생성 (예: [1,2,3,4,5])
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={{ width: "90%", minWidth: "440px", margin: "30px auto", display: "flex", justifyContent: "center", gap: "8px" }}>
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: "7px 14px",
            borderRadius: "6px",
            border: "none",
            background: page === currentPage ? "#2563eb" : "#f3f4f6",
            color: page === currentPage ? "#fff" : "#222",
            fontWeight: "bold",
            fontSize: "15px",
            cursor: "pointer",
            boxShadow: page === currentPage ? "0 2px 8px rgba(37,99,235,0.10)" : "none"
          }}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
