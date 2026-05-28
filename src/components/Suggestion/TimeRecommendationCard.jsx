import React from "react";
import styles from "./RecommendationCard.module.css";

const TimeRecommendationCard = ({ item }) => {
  const {
    title,
    description,
    image_url,
    month,
    target_grade
  } = item;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className={styles.imageBox}>
        {image_url ? (
          <img src={image_url} alt="추천 이미지" />
        ) : (
          <div className={styles.noImage}>이미지 없음</div>
        )}
      </div>
      <div className={styles.cardFooter}>
        <p>추천 시기: {month}월</p>
        {target_grade && <p>대상 학년: {target_grade}학년</p>}
      </div>
    </div>
  );
};

export default TimeRecommendationCard;
