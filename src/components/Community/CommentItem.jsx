import { useState } from "react";
import clsx from "clsx";
import styles from "../../styles/Community/CommentItem.module.css";
import ReportForm from "../../pages/Community/ReportForm";
import {
  createComment,
  updateComment,
  deleteComment,
} from "../../api/communityApi";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

const CommentItem = ({ comment, user, fetchPost, depth = 0, postId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [showChildren, setShowChildren] = useState(true);
  const { isBanned, bannedUntil } = useAuth();

  const isOwner =
    user?.user_id === comment.user_id || user?.type === "admin";

  /* ─────────── CRUD helpers ─────────── */
  const handleUpdate = async () => {
    try {
      await updateComment(comment.comment_id, { content: editedContent });
      toast("댓글 수정 완료");
      setIsEditing(false);
      fetchPost();
    } catch {
      toast("수정 실패");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    try {
      await deleteComment(comment.comment_id);
      toast("삭제 완료");
      fetchPost();
    } catch {
      toast("삭제 실패");
    }
  };

  const handleReply = async () => {
    if (isBanned) {                               // ⭐ 추가
      toast(`정지중입니다. ${bannedUntil} 까지`, { icon: "⚠️" });
      return;
    }
    if (!replyContent.trim()) return;
    try {
      await createComment(postId, {
        content: replyContent,
        parent_comment_id: comment.comment_id,
      });
      setReplyContent("");
      setShowReply(false);
      fetchPost();
    } catch {
      toast("작성 실패");
    }
  };

  /* ─────────── render ─────────── */
  return (
    <div
      className={clsx(
        styles.commentCard,
        styles[`depth${Math.min(depth, 3)}`]
      )}
    >
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.author}>{comment.User?.name}</span>
          <span className={styles.date}>{new Date(comment.created_at).toLocaleString()}</span>
        </div>

        {isOwner && !isEditing && (
          <div className={styles.ownerBtns}>
            <button onClick={() => setIsEditing(true)}>수정</button>
            <button onClick={handleDelete}>삭제</button>
          </div>
        )}
      </div>


      {/* 본문 */}
      {isEditing ? (
        <div className={styles.editBox}>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className={styles.editBtns}>
            <button onClick={handleUpdate}>저장</button>
            <button onClick={() => setIsEditing(false)}>취소</button>
          </div>
        </div>
      ) : (
        <p className={styles.content}>{comment.content}</p>
      )}

      {/* 푸터: 답글/신고/접기 */}
      <div className={styles.footer}>
        <button
          className={styles.tagBtn}
          disabled={isBanned}
          onClick={() => {
            if (isBanned) {
              toast(`정지중입니다. ${bannedUntil} 까지`, { icon: "⚠️" });
            } else {
              setShowReply((p) => !p);
            }
          }}
        >
          {isBanned ? "정지중" : "💬 답글"}
        </button>
        <button
          className={styles.tagBtn}
          onClick={() => setShowReport((p) => !p)}
        >
          🚨 신고
        </button>
        {comment.replies?.length > 0 && (
          <button
            className={styles.tagBtn}
            onClick={() => setShowChildren((p) => !p)}
          >
            {showChildren ? "⬆︎ 답글 숨기기" : `⬇︎ 답글 ${comment.replies.length}`}
          </button>
        )}
      </div>

      {/* 신고 폼 */}
      {showReport && (
        <ReportForm
          targetType="comment"
          targetId={comment.comment_id}
          onClose={() => setShowReport(false)}
        />
      )}

      {/* 답글 작성 */}
      {showReply && (
        !isBanned && (
          <div className={styles.replyBox}>
            <textarea
              placeholder="답글 내용"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <button onClick={handleReply}>등록</button>
          </div>
        )
      )}

      {/* 자식 댓글 */}
      {showChildren &&
        comment.replies?.map((child) => (
          <CommentItem
            key={child.comment_id}
            comment={child}
            postId={postId}
            user={user}
            fetchPost={fetchPost}
            depth={depth + 1}
          />
        ))}
    </div>
  );
};

export default CommentItem;
