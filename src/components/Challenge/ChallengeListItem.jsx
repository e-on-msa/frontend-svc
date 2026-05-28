// src/components/Challenge/ChallengeListItem.jsx
import { useNavigate } from "react-router-dom";

const statusStyle = {
  모집중: {
    color: "#2563eb",
    border: "1.5px solid #bae6fd",
    background: "#f0f9ff"
  },
  마감: {
    color: "#6b7280",
    border: "1.5px solid #d1d5db",
    background: "#f9fafb"
  }
};

function formatDateRange(start, end) {
  if (!start || !end) return "";
  const s = new Date(start).toLocaleDateString("ko-KR");
  const e = new Date(end).toLocaleDateString("ko-KR");
  return `${s} ~ ${e}`;
}

const ChallengeListItem = ({
  challenge_id,
  challenge_state,
  title,
  start_date,
  end_date,
  onApply,
  my_participation,
  age_range,
  minimum_age,
  maximum_age,
  userAge,
  userId,
  user_id,        // 소유자 id
  creator_id,     // (호환용)
  creator         // (호환용)
}) => {
  const navigate = useNavigate();

  // 상태 → 한국어
  const statusMap = { ACTIVE: "모집중", CLOSED: "마감", CANCELLED: "취소됨" };
  const status = statusMap[challenge_state] || challenge_state;

  // 참여 여부
  const isJoined =
    !!my_participation && my_participation.participating_state !== "취소";
  const participationId = my_participation?.participating_id;
  const participationState = my_participation?.participating_state;

  // 나이 범위 계산
  let minAge = minimum_age ?? null;
  let maxAge = maximum_age ?? null;
  if ((minAge === null || maxAge === null) && typeof age_range === "string" && age_range.trim() !== "") {
    const m = age_range.match(/(\d+)\s*~\s*(\d+)/);
    if (m) {
      minAge = Number(m[1]);
      maxAge = Number(m[2]);
    }
  }
  const canJoinByAge =
    userAge == null || minAge == null || maxAge == null
      ? true
      : userAge >= minAge && userAge <= maxAge;

  // 마감 여부
  const isClosed = challenge_state !== "ACTIVE";

  // 소유자 여부
  const isOwner =
    (userId != null) &&
    (String(user_id) === String(userId) ||
     String(creator_id ?? "") === String(userId) ||
     String(creator?.user_id ?? "") === String(userId));

  // 버튼 비활성화 조건
  const disableApply = !canJoinByAge || isClosed;

  const handleGoDetail = () => {
    navigate(`/challenge/${challenge_id}`);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "#fff",
        borderRadius: "12px",
        border: "2px solid #a3a3a3",
        padding: "12px 16px",
        marginBottom: "17px",
        gap: "26px",
        minHeight: "68px",
        cursor: "pointer"
      }}
      onClick={handleGoDetail}
    >
      {/* 상태 박스 */}
      <div
        style={{
          minWidth: "68px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "15px",
          borderRadius: "8px",
          padding: "7px 0",
          ...statusStyle[status]
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {status}
      </div>

      {/* 제목/기간 */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "17px", fontWeight: "bold", marginBottom: "5px" }}>
          {title}
        </div>
        <div style={{ fontSize: "14px", color: "#6b7280" }}>
          {formatDateRange(start_date, end_date)}
        </div>
      </div>

      {/* 버튼: 소유자는 아예 렌더링하지 않음 */}
      {!isOwner && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (disableApply) return;
            onApply({
              challenge_id,
              isJoined,
              participationId,
              participationState
            });
          }}
          disabled={disableApply}
          style={{
            background: disableApply ? "#eee" : isJoined ? "#fef2f2" : "#f3f4f6",
            color: disableApply ? "#bbb" : isJoined ? "#e11d48" : "#1f2937",
            border: "none",
            borderRadius: "7px",
            padding: "10px 23px",
            fontWeight: "bold",
            fontSize: "15px",
            cursor: disableApply ? "not-allowed" : "pointer",
            transition: "background 0.15s"
          }}
        >
          {disableApply
            ? (isClosed
                ? "마감됨"
                : (minAge === maxAge
                    ? `${maxAge}세만 신청 가능`
                    : `${minAge ?? "?"}~${maxAge ?? "?"}세만 신청 가능`))
            : (isJoined ? "참여 취소" : "신청하기")}
        </button>
      )}
    </div>
  );
};

export default ChallengeListItem;
