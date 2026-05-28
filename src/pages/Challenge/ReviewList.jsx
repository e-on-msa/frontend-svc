import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../../components/Common/Header";
import ReviewListSection from "../../components/Review/ReviewListSection";
import { getChallengeReviews } from "../../api/challengeApi";
import styles from "../../styles/Challenge/ReviewList.module.css";

const ReviewList = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!challengeId) return;

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await getChallengeReviews(challengeId);
        setReviews(res.data);
      } catch (e) {
        console.error("리뷰 조회 오류:", e);
        setError("리뷰를 불러오는 중 오류가 발생했습니다.");
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [challengeId]);

  return (
    <div>
      <div className={styles.header}>
        <Header />
      </div>

      <div className={styles.wrapper}>
        <div className={styles.topRow}>
          <h2 className={styles.title}>리뷰 목록</h2>
          <button
            className={styles.writeBtn}
            onClick={() =>
              navigate(`/challenge/${challengeId}/review/create`)
            }
          >
            리뷰 작성
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>
            리뷰 불러오는 중…
          </div>
        ) : error ? (
          <div className={styles.error}>
            {error}
          </div>
        ) : (
          <ReviewListSection reviews={reviews} />
        )}
      </div>
    </div>
  );
};

export default ReviewList;
