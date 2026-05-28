import Header from "../../components/Common/Header";
import ReviewCreateForm from "../../components/Review/ReviewCreateForm";
import { useParams, useNavigate } from "react-router-dom";
import { getChallengeReviews, updateReview } from "../../api/challengeApi";
import { useEffect, useState } from "react";
import styles from "../../styles/Challenge/ReviewEdit.module.css";

const ReviewEdit = () => {
  const { challengeId, reviewId } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOneReview = async () => {
      setLoading(true);
      try {
        const res = await getChallengeReviews(challengeId);
        const found = res.data.find(
          (r) => String(r.review_id) === String(reviewId)
        );

        if (!found) {
          alert("해당 리뷰를 찾을 수 없습니다.");
          navigate(`/challenge/${challengeId}/reviews`);
          return;
        }

        setInitialData(found);
      } catch (e) {
        console.error("리뷰 조회 오류:", e);
        alert("리뷰를 불러오는 데 실패했습니다.");
        navigate(`/challenge/${challengeId}/reviews`);
      } finally {
        setLoading(false);
      }
    };

    fetchOneReview();
  }, [challengeId, reviewId, navigate]);

  const handleEdit = async ({ rating_stars, text }) => {
    setLoading(true);
    try {
      await updateReview(reviewId, { rating_stars, text });
      alert("리뷰가 수정되었습니다!");
      navigate(`/challenge/${challengeId}/reviews`);
    } catch (e) {
      console.error("리뷰 수정 오류:", e);
      alert("리뷰 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !initialData) {
    return (
      <div className={styles.loading}>로딩 중…</div>
    );
  }

  return (
    <div>
      <div className={styles.header}>
        <Header />
      </div>
      <ReviewCreateForm
        challengeId={challengeId}
        mode="edit"
        initialData={initialData}
        onSubmit={handleEdit}
      />
    </div>
  );
};

export default ReviewEdit;
