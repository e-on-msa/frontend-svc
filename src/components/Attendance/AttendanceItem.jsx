const AttendanceItem = ({ num, name,date, status, reason, onStatus, onReason, onDelete }) => (
  <div style={{ marginBottom: 25 }}>
    {/* 상단: 번호/이름/버튼 */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 7,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
        <span style={{ fontWeight: 600, fontSize: 20 }}>{num}</span>
        <span style={{ fontWeight: "bold", fontSize: 18 }}>{name}</span>
        <span style={{ color: "#888", fontSize: 16, marginLeft: 8 }}>{date}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <button
          style={{
            background: status === "출석" ? "#4ade80" : "#d4d4d4",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: "bold",
            fontSize: 16,
            padding: "8px 23px",
            marginRight: 6,
            cursor: "pointer",
          }}
          onClick={() => onStatus("출석")}
        >
          출석
        </button>
        <button
          style={{
            background: status === "결석" ? "#dc2626" : "#d4d4d4",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: "bold",
            fontSize: 16,
            padding: "8px 23px",
            cursor: "pointer",
          }}
          onClick={() => onStatus("결석")}
        >
          결석
        </button>
        {/* ★ 삭제(X) 버튼 */}
        <button
          style={{
            marginLeft: 10,
            background: "#fff",
            color: "#999",
            border: "1.5px solid #ccc",
            borderRadius: "50%",
            width: 32,
            height: 32,
            fontSize: 19,
            fontWeight: "bold",
            lineHeight: "30px",
            cursor: "pointer",
          }}
          title="출석 기록 삭제"
          onClick={onDelete}
        >×</button>
      </div>
    </div>
    <input
      style={{
        width: "100%",
        border: "1.5px solid #e5e7eb",
        borderRadius: 7,
        padding: "11px 14px",
        fontSize: 15,
      }}
      placeholder="결석 사유를 입력하세요."
      value={reason}
      onChange={e => onReason(e.target.value)}
      disabled={status !== "결석"}
    />
  </div>
);

export default AttendanceItem;
