import { useState } from 'react';
import { reportContent } from '../../api/communityApi';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/Community/ReportForm.module.css';

const ReportForm = ({ targetType, targetId, onClose }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      alert('신고 사유를 입력해주세요.');
      return;
    }

    if (!user || !user.user_id) {
      alert('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    try {
      await reportContent(targetType, targetId, reason, user.user_id);
      setSuccess(true);
    } catch (error) {
      console.error('신고 실패:', error);
      alert('신고에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.reportForm}>
      {success ? (
        <div className={styles.successMessage}>
          <p>✅ 신고가 접수되었습니다.</p>
          <button onClick={onClose} className={styles.closeButton}>닫기</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3 className={styles.title}>
            {targetType === 'post' ? '게시글' : '댓글'} 신고
          </h3>
          <textarea
            className={styles.textarea}
            placeholder="신고 사유를 입력해주세요"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            required
          />
          <div className={styles.buttonGroup}>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? '신고 중...' : '신고하기'}
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              취소
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReportForm;
