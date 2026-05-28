// src/components/Review/ReviewItem.jsx

import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ReviewItem = ({ review, onDelete, deleting }) => {
    const navigate = useNavigate();
    const { challengeId } = useParams();
    const { user } = useAuth();

    // 날짜 YYYY-MM-DD 로 포맷
    const formattedDate = review.review_date
        ? review.review_date.split("T")[0]
        : "-";

    const isMyReview = user.user_id === review.user_id;

    return (
        <div
            style={{
                border: "1.5px solid #e5e7eb",
                borderRadius: 8,
                padding: "17px 16px",
                marginBottom: 17,
                background: "#fafafb",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
            <div>
                <div style={{ fontWeight: "bold" }}>
                    {review.writer?.name || `유저${review.user_id}`}
                </div>
                <div style={{ color: "#888", fontSize: 14, marginBottom: 7 }}>
                    평점: {review.rating_stars} | {formattedDate}
                </div>
                <div>{review.text}</div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
                {/* 리뷰 수정 버튼 */}
                {isMyReview && (
                    <button
                        style={{
                            background: "#fff",
                            border: "1.5px solid #2563eb",
                            color: "#2563eb",
                            borderRadius: 8,
                            padding: "4px 16px",
                            fontWeight: "bold",
                            fontSize: 14,
                            cursor: "pointer",
                        }}
                        onClick={() =>
                            navigate(
                                `/challenge/${challengeId}/review/${review.review_id}/edit`
                            )
                        }>
                        수정
                    </button>
                )}
                {/* 리뷰 삭제 버튼: deleting일 때는 비활성화 */}
                {isMyReview && (
                    <button
                        style={{
                            background: deleting ? "#f5a5a5" : "#fff",
                            border: deleting
                                ? "1.5px solid #f05d5d"
                                : "1.5px solid #f87171",
                            color: deleting ? "#fff" : "#e11d48",
                            borderRadius: 8,
                            padding: "4px 16px",
                            fontWeight: "bold",
                            fontSize: 14,
                            cursor: deleting ? "not-allowed" : "pointer",
                            opacity: deleting ? 0.6 : 1,
                        }}
                        onClick={() => onDelete(review.review_id)}
                        disabled={deleting}>
                        {deleting ? "삭제 중…" : "삭제"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReviewItem;
