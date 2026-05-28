const ChallengeSearchBar = ({ search, setSearch, onSearch }) => (
  <div style={{ display: "flex", width: "100%" }}>
    <input
      type="text"
      value={search}
      onChange={e => setSearch(e.target.value)}
      placeholder="챌린지명, 키워드"
      style={{
        flex: 1,
        padding: "20px 24px",
        border: "2px solid #e5e7eb",
        borderRadius: "12px 0 0 12px",
        background: "#fff",
        fontSize: "15px"
      }}
      onKeyDown={e => { if (e.key === 'Enter') onSearch(); }}
    />
    <button
      onClick={onSearch}
      style={{
        padding: "0 20px",
        background: "#e5e7eb",
        color: "#fff",
        border: "none",
        borderRadius: "0 8px 8px 0",
        fontSize: "15px",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      검색
    </button>
  </div>
);
export default ChallengeSearchBar;
