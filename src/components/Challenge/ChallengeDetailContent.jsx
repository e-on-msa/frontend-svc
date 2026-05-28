// src/components/Challenge/ChallengeDetailContent.jsx

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBookmark } from "react-icons/fa6";
import {
  participateChallenge,
  cancelParticipation,
  addBookmark,
  removeBookmark,
  deleteChallenge,
  getChallengeReviews,
} from "../../api/challengeApi";

// 리뷰 프리뷰
const ReviewPreview = ({ reviewerName, rating, comment, date }) => {
  const formatted = date ? date.split("T")[0] : "-";
  return (
    <div style={{ borderBottom: "1px solid #e5e7eb", padding: "8px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontWeight: 600 }}>{reviewerName}</span>
        <span style={{ color: "#888", fontSize: 12 }}>{formatted}</span>
      </div>
      <div style={{ marginBottom: 4 }}>
        {rating > 0 ? <span style={{ color: "#f59e0b", fontSize: 14 }}>{"★".repeat(rating)}</span> : null}
      </div>
      <div style={{ fontSize: 14, color: "#333" }}>{comment || "(리뷰 내용이 없습니다.)"}</div>
    </div>
  );
};

const ChallengeDetailContent = ({
  challenge,
  userAge,
  bookmarked,
  setBookmarked,
  userId,
  isJoined,
  setIsJoined,
  participationId,
  setParticipationId,
  participationState,
  refresh,
  hideActions = false,
  hideReviews = false, // ← 추가: 리뷰 숨김 제어
}) => {
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // 0) 나이 조건 추출
  let minAgeNum = null,
    maxAgeNum = null;
  if (typeof challenge.age_range === "string") {
    const m = challenge.age_range.match(/(\d+)\s*~\s*(\d+)/);
    if (m) {
      minAgeNum = Number(m[1]);
      maxAgeNum = Number(m[2]);
    }
  }
  const canJoinByAge =
    typeof userAge === "number" &&
    minAgeNum !== null &&
    maxAgeNum !== null &&
    userAge >= minAgeNum &&
    userAge <= maxAgeNum;

  const isOwner = challenge.creator_id === userId || challenge.creator?.user_id === userId;

  // 1) 리뷰 가져오기 (hideReviews면 호출도 스킵)
  useEffect(() => {
    if (hideReviews) {
      setReviews([]);
      setReviewsLoading(false);
      return;
    }
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const res = await getChallengeReviews(challenge.challenge_id);
        const data = res.data.map((r) => ({
          id: r.review_id,
          reviewerName: r.writer?.name || `유저${r.user_id}`,
          rating: r.rating_stars,
          comment: r.text,
          date: r.review_date,
        }));
        setReviews(data);
      } catch (e) {
        console.error("리뷰 조회 실패:", e);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [challenge.challenge_id, hideReviews]);

  // 2) 참여/취소 핸들러
  const handleCancel = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      if (!participationId) {
        alert("참여 기록이 없습니다.");
        setActionLoading(false);
        return;
      }
      await cancelParticipation(participationId);
      alert("참여가 취소되었습니다.");
      await new Promise((res) => setTimeout(res, 300));
      await refresh();
    } catch (error) {
      alert("참여 취소 중 오류가 발생했습니다.");
      console.error(error);
    }
    setActionLoading(false);
  };

  const handleJoin = async () => {
    if (actionLoading) return;
    setActionLoading(true);

    // 과거 '취소'에서 재신청
    if (participationId && participationState === "취소") {
      try {
        await cancelParticipation(participationId).catch(() => {});
        await new Promise((res) => setTimeout(res, 200));
      } catch (e) {
        console.log("참여취소 에러(무시)", e);
      }
      try {
        await participateChallenge(challenge.challenge_id, { user_id: userId });
        alert("참여가 완료되었습니다!");
        await new Promise((res) => setTimeout(res, 300));
        await refresh();
      } catch (error) {
        alert("참여 중 오류가 발생했습니다.");
        console.error(error);
      }
      setActionLoading(false);
      return;
    }

    try {
      if (isJoined) {
        await handleCancel();
        setActionLoading(false);
        return;
      }
      await participateChallenge(challenge.challenge_id, { user_id: userId });
      alert("참여가 완료되었습니다!");
      await new Promise((res) => setTimeout(res, 300));
      await refresh();
    } catch (error) {
      if (error.response?.status === 409) {
        alert("이미 참여한 상태입니다. 새로고침합니다.");
        await refresh();
      } else {
        alert("참여 중 오류가 발생했습니다.");
        console.error(error);
      }
    }
    setActionLoading(false);
  };

  // 3) 상태/표기 유틸
  const statusMap = { ACTIVE: "모집중", CLOSED: "마감", CANCELLED: "취소됨" };
  const status = statusMap[challenge.challenge_state] || challenge.challenge_state;

  // ✅ 추가: 마감 여부 플래그 (CLOSED면 신청 버튼 비활성화)
  const isClosed = challenge.challenge_state === "CLOSED";

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };

  const period =
    challenge.duration && challenge.duration.start && challenge.duration.end
      ? `${formatDate(challenge.duration.start)} ~ ${formatDate(challenge.duration.end)}`
      : "-";

  const isRegular = challenge.is_recuming ? "정기" : "비정기";
  const repeatCycle =
    challenge.repeat_type === "WEEKLY"
      ? "주 1회"
      : challenge.repeat_type === "DAILY"
      ? "매일"
      : challenge.repeat_type || "";

  const daysKorean = (challenge.days || []).map((day) => {
    const dayMap = {
      Monday: "월",
      Tuesday: "화",
      Wednesday: "수",
      Thursday: "목",
      Friday: "금",
      Saturday: "토",
      Sunday: "일",
    };
    return dayMap[day] || day;
  });

  const allowJoinMid = challenge.intermediate_participation ? "허용" : "비허용";

  const interestsList = (challenge.interests || []).map((i) => i.interest_detail).filter(Boolean);
  const visionsList = (challenge.visions || []).map((v) => v.vision_detail).filter(Boolean);

  const fieldView = (
    <>
      <div>
        <b>관심</b> : {interestsList.length > 0 ? interestsList.join(", ") : "-"}
      </div>
      <div>
        <b>진로</b> : {visionsList.length > 0 ? visionsList.join(", ") : "-"}
      </div>
    </>
  );

  const phone = (challenge.creator && challenge.creator.phone) || challenge.creator_contact || "-";
  const creatorName = challenge.creator?.name || "-";
  const creatorEmail = challenge.creator?.email || "-";

  const deadline = challenge.application_deadline ? formatDate(challenge.application_deadline) : null;

  // 4) 첨부파일
  const photoObj =
    Array.isArray(challenge.attachments) &&
    challenge.attachments.find((att) => att.attachment_type === "이미지");
  const consentObj =
    Array.isArray(challenge.attachments) &&
    challenge.attachments.find((att) => att.attachment_type === "문서");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const STATIC_BASE = BASE_URL.replace(/\/api\/?$/, "");

  // 5) 삭제 & 북마크
  const handleDelete = async () => {
    if (window.confirm("정말로 이 챌린지를 삭제하시겠습니까?")) {
      try {
        await deleteChallenge(challenge.challenge_id);
        alert("챌린지가 삭제되었습니다.");
        navigate("/challenge");
      } catch (e) {
        alert("권한이 없습니다");
        console.error(e);
      }
    }
  };

  const toggleBookmark = async () => {
    try {
      if (bookmarked) {
        await removeBookmark(challenge.challenge_id, userId);
        setBookmarked(false);
        alert("북마크가 해제되었습니다!");
      } else {
        await addBookmark(challenge.challenge_id, userId);
        setBookmarked(true);
        alert("북마크에 추가되었습니다!");
      }
    } catch (e) {
      if (e.response && e.response.status === 409) {
        setBookmarked(true);
        alert("이미 북마크되어 있습니다!");
      } else {
        alert("북마크 처리 중 오류가 발생했습니다.");
        console.error(e);
      }
    }
  };

  // 6) JSX
  return (
    <div
      style={{
        maxWidth: 1040,
        margin: "20px auto",
        background: "#fff",
        border: "1.5px solid #e5e7eb",
        borderRadius: 14,
        padding: 36,
        color: "#222",
      }}
    >
      {/* 상단 header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              border: status === "모집중" ? "1.5px solid #38bdf8" : "1.5px solid #bbb",
              color: status === "모집중" ? "#38bdf8" : "#bbb",
              fontWeight: 600,
              fontSize: 15,
              borderRadius: 8,
              padding: "3.5px 18px",
            }}
          >
            {status}
          </span>
          <div>
            <div style={{ fontWeight: "bold", fontSize: 25 }}>{challenge.title}</div>
            <div style={{ color: "#666", fontSize: 15, marginTop: 2 }}>
              {period}
              {deadline && <> | 신청 마감 {deadline}</>}
            </div>
          </div>
        </div>

        {/* 오른쪽 버튼 영역 */}
        {!hideActions && (
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* 출석부 버튼 (소유자만) */}
            {isOwner && (
              <button
                style={{
                  background: "#f9fafb",
                  color: "#2563eb",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: 8,
                  padding: "7px 20px",
                  fontWeight: "bold",
                  fontSize: 15,
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/attendance/${challenge.challenge_id}`)}
              >
                출석부
              </button>
            )}

            {/* 북마크 버튼 */}
            <button
              onClick={toggleBookmark}
              style={{ background: "none", border: "none", cursor: "pointer", marginRight: 4 }}
            >
              <FaBookmark size={25} color={bookmarked ? "#38bdf8" : "#bbb"} />
            </button>

            {/* 참여/취소 버튼 (마감이면 회색 비활성) */}
            {/* 참여/취소 버튼 (마감이면 회색 비활성, 개설자는 숨김) */}
            {!isOwner && (
              <button
                disabled={!canJoinByAge || actionLoading || isClosed}
                style={{
                  background: (!canJoinByAge || isClosed) ? "#eee" : isJoined ? "#fef2f2" : "#e5e7eb",
                  color: (!canJoinByAge || isClosed) ? "#bbb" : isJoined ? "#e11d48" : "#222",
                  border: isJoined ? "1.5px solid #fca5a5" : "none",
                  borderRadius: 8,
                  padding: "9px 28px",
                  fontWeight: "bold",
                  fontSize: 16,
                  cursor: (!canJoinByAge || isClosed) ? "not-allowed" : "pointer",
                }}
                onClick={
                  (!canJoinByAge || isClosed)
                    ? () => {
                        if (isClosed) {
                          alert("모집이 마감된 챌린지입니다.");
                        } else {
                          alert(`참여 가능 연령이 아닙니다! (${minAgeNum}~${maxAgeNum}세만 신청 가능)`);
                        }
                      }
                    : isJoined
                    ? handleCancel
                    : handleJoin
                }
              >
                {isClosed
                  ? "모집 마감"
                  : !canJoinByAge
                    ? minAgeNum === maxAgeNum
                      ? `${maxAgeNum}세만 신청 가능`
                      : `${minAgeNum}~${maxAgeNum}세만 신청 가능`
                    : isJoined
                      ? "참여 취소"
                      : "신청하기"}
              </button>
            )}


            {/* 수정/삭제 (소유자만) */}
            {isOwner && (
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <button
                  style={{
                    background: "#fff",
                    border: "1.5px solid #2563eb",
                    color: "#2563eb",
                    borderRadius: 8,
                    padding: "8px 22px",
                    fontWeight: "bold",
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/challenge/${challenge.challenge_id}/edit`)}
                >
                  수정
                </button>
                <button
                  style={{
                    background: "#fff",
                    border: "1.5px solid #f87171",
                    color: "#e11d48",
                    borderRadius: 8,
                    padding: "8px 22px",
                    fontWeight: "bold",
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                  onClick={handleDelete}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 사진 */}
      {photoObj ? (
        <img
          src={`${STATIC_BASE}${photoObj.url}`}
          alt="챌린지 사진"
          onError={(e) => {
            e.target.src = "/no_img.png"; // public 폴더의 noimg.png
          }}
          style={{
            width: "100%",
            height: "500px",
            objectFit: "cover",
            borderRadius: 13,
            marginBottom: 25
          }}
        />
      ) : (
        <img
          src="/no_img.png"
          alt="기본 이미지"
          style={{
            width: "100%",
            height: "500px",
            objectFit: "cover",
            borderRadius: 13,
            marginBottom: 25
          }}
        />
      )}

      {/* 2단 영역 */}
      <div style={{ display: "flex", gap: 34, marginBottom: 26 }}>
        {/* 1열(왼쪽): 정보 */}
        <div style={{ flex: hideReviews ? 1 : 1.1 }}>
          <InfoRow
            label="정기여부"
            value={
              isRegular === "정기" ? (
                <>
                  정기{" "}
                  <span style={{ color: "#444" }}>
                    (
                    {repeatCycle}
                    {daysKorean.length > 0 ? " | " + daysKorean.join(", ") : ""}
                    )
                  </span>
                </>
              ) : (
                "비정기"
              )
            }
          />
          <InfoRow label="중도참여" value={allowJoinMid} />
          <InfoRow label="활동분야" value={fieldView} />
          <InfoRow label="인원" value={challenge.maximum_people || "-"} />
          <InfoRow label="연령" value={`${minAgeNum} ~ ${maxAgeNum}`} />
          <InfoRow label="사용자" value={creatorName} />
          <InfoRow label="이메일" value={creatorEmail} />
          <InfoRow label="전화번호" value={phone} />
        </div>

        {/* 2열(오른쪽): 리뷰 (hideReviews면 통째로 숨김) */}
        {!hideReviews && (
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
              <div style={{ fontWeight: "bold", fontSize: 16 }}>리뷰</div>
              <div>
                <button
                  style={{
                    marginRight: 7,
                    background: "#f3f3f3",
                    border: "1.5px solid #e5e7eb",
                    color: "#2563eb",
                    borderRadius: 7,
                    fontWeight: "bold",
                    fontSize: 15,
                    padding: "7px 18px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/challenge/${challenge.challenge_id}/review/create`)}
                >
                  리뷰 작성
                </button>
                <button
                  style={{
                    background: "#f3f3f3",
                    border: "1.5px solid #e5e7eb",
                    color: "#888",
                    borderRadius: 7,
                    fontWeight: "bold",
                    fontSize: 15,
                    padding: "7px 18px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/challenge/${challenge.challenge_id}/reviews`)}
                >
                  더보기
                </button>
              </div>
            </div>

            <div
              style={{
                border: "1.5px solid #e5e7eb",
                borderRadius: 8,
                background: "#fafafa",
                minHeight: 80,
                padding: "8px 15px",
              }}
            >
              {reviewsLoading ? (
                <div style={{ textAlign: "center", color: "#888" }}>리뷰 불러오는 중…</div>
              ) : reviews.length === 0 ? (
                <div style={{ color: "#666", fontSize: 14 }}>등록된 리뷰가 없습니다.</div>
              ) : (
                reviews.slice(0, 3).map((rv) => (
                  <ReviewPreview key={rv.id} reviewerName={rv.reviewerName} rating={rv.rating} comment={rv.comment} date={rv.date} />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* 상세설명 */}
      <div>
        <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>상세정보</div>
        <div
          style={{
            border: "1.5px solid #e5e7eb",
            borderRadius: 13,
            background: "#fafafd",
            padding: "28px 20px",
            minHeight: 110,
            fontSize: 17,
          }}
        >
          {challenge.description || "상세 정보가 없습니다."}
        </div>
      </div>

      {/* 동의서 */}
      {consentObj ? (
        <div style={{ marginTop: 30 }}>
          <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>보호자 동의서</div>
          <div>
            <a
              href={`${STATIC_BASE}${consentObj.url}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                padding: "8px 14px",
                background: "#2563eb",
                color: "#fff",
                borderRadius: 6,
                textDecoration: "none",
                fontSize: 15,
              }}
            >
              {consentObj.attachment_name || "동의서 보기 / 다운로드"}
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div style={{ display: "flex", marginBottom: 8 }}>
    <div style={{ width: 90, color: "#444", fontWeight: 500 }}>{label}</div>
    <div>{value}</div>
  </div>
);

export default ChallengeDetailContent;
