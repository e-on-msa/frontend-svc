// src/components/Review/ReviewListSection.jsx

import { useState } from "react";
import ReviewItem from "./ReviewItem";
import { deleteReview } from "../../api/challengeApi"; // ★ import 추가

const ReviewListSection = ({ reviews: initialReviews }) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [loadingIds, setLoadingIds] = useState([]); // 삭제 중인 리뷰 ID들을 담을 배열

  const handleDelete = async (reviewId) => {
    // 중복 클릭 방지: 이미 로딩 중이면 리턴
    if (loadingIds.includes(reviewId)) return;

    if (!window.confirm("정말로 이 리뷰를 삭제할까요?")) return;

    // 로딩 상태에 추가
    setLoadingIds((prev) => [...prev, reviewId]);

    try {
      await deleteReview(reviewId);
      // 삭제 성공 시 로컬 상태에서 해당 리뷰 지우기
      setReviews((prev) => prev.filter((r) => r.review_id !== reviewId));
    } catch (e) {
      console.error("리뷰 삭제 오류:", e);
      if (e.response) {
        alert(`리뷰 삭제에 실패했습니다: ${JSON.stringify(e.response.data)}`);
      } else {
        alert("리뷰 삭제 중 네트워크 오류가 발생했습니다.");
      }
    } finally {
      // 로딩 상태에서 제거
      setLoadingIds((prev) => prev.filter((id) => id !== reviewId));
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div style={{ color: "#aaa", textAlign: "center", padding: "50px 0" }}>
        아직 등록된 리뷰가 없습니다.
      </div>
    );
  }

  return (
    <div>
      {reviews.map((review) => (
        <ReviewItem
          key={review.review_id}
          review={review}
          onDelete={handleDelete}
          deleting={loadingIds.includes(review.review_id)} // 삭제 중 플래그
        />
      ))}
    </div>
  );
};

export default ReviewListSection;
