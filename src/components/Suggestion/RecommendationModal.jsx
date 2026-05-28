import React from 'react';
import styles from './RecommendationModal.module.css';

const RecommendationModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
        {item.image_url && (
  <img
    src={item.image_url}
    alt={item.title}
    style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
  />
)}

        <h2>{item.title}</h2>
    
        <p className={styles.description}>{item.description}</p>
        <div className={styles.meta}>
          <span>월: {item.month}월</span>
          <span>대상: {item.school_type === 'elementary' ? '초등학생' : '중학생'}</span>
        </div>
      </div>
    </div>
  );
};

export default RecommendationModal;
