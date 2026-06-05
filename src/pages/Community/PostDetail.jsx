import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Header from "../../components/Common/Header";
import {
  getPost,
  updatePost,
  deletePost,
  createComment,
} from "../../api/communityApi";
import ReportForm from "../../pages/Community/ReportForm";
import { buildCommentTree } from "../../utils/buildCommentTree";
import CommentItem from "../../components/Community/CommentItem";
import styles from "../../styles/Community/PostDetail.module.css";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_BASE_URL || "http://8.232.7.222";

const PostDetail = () => {
    const { board_id, post_id } = useParams();
    const navigate = useNavigate();
    const { user, isBanned, bannedUntil } = useAuth();

    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showReportPost, setShowReportPost] = useState(false);

    // ───────── 수정 관련 상태 ─────────
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedContent, setEditedContent] = useState("");

    const [existingImgs, setExistingImgs] = useState([]);
    const [removedIds, setRemovedIds] = useState([]);
    const [newFiles, setNewFiles] = useState([]);

    // ───────── 게시글 가져오기 ─────────
    const fetchPost = async () => {
      try {
        const res = await getPost(board_id, post_id);

        setPost({
          ...res.data.post,
          comments: res.data.comments || [],
          pagination: res.data.pagination,
        });

        setExistingImgs(res.data.post.images || []);
        setRemovedIds([]);
        setNewFiles([]);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    };

    useEffect(() => {
        fetchPost();
    }, [board_id, post_id]);

    // ───────── 이미지 관련 핸들러 ─────────
    const handleFileChange = (e) => {
      if (isBanned) {
        toast(`정지 중입니다. ${bannedUntil} 까지`, { icon: "⚠️" });
        return;
      }
      const files = Array.from(e.target.files).map((f) => {
        f.previewURL = URL.createObjectURL(f);
        return f;
      });
      setNewFiles(files);
    };

    useEffect(
        () => () => newFiles.forEach((f) => URL.revokeObjectURL(f.previewURL)),
        [newFiles]
    );

    const toggleRemoveExisting = (id) => {
        setRemovedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // ───────── 게시글 수정 저장 ─────────
    const handleSave = async () => {
      if (isBanned) {
        toast(`정지 중입니다. ${bannedUntil} 까지`, { icon: "⚠️" });
        return;
      }
      try {
        const fd = new FormData();
        fd.append("title", editedTitle);
        fd.append("content", editedContent);

        newFiles.forEach((f) => fd.append("images", f));
        if (removedIds.length)
            fd.append("removed_ids", JSON.stringify(removedIds));

        await updatePost(post_id, fd);
        toast("게시글이 수정되었습니다.", { icon: "💜" });

        setIsEditing(false);
        fetchPost();
        } catch (err) {
        console.error("수정 실패:", err);
        toast("게시글 수정 중 오류가 발생했습니다.", { icon: "⚠️" });
      }
    };

    // 게시글 삭제
    const handleDelete = async () => {
    if (!window.confirm("정말 게시글을 삭제하시겠습니까?")) return;
    try {
        await deletePost(post_id);           // API 호출
        toast("게시글이 삭제되었습니다.", { icon: "💜" });
        navigate("/community");              // 목록 페이지로 이동
    } catch (err) {
        console.error("삭제 실패:", err);
        toast("게시글 삭제 중 오류가 발생했습니다.", { icon: "⚠️" });
    }
    };

    // 댓글 등록
    const handleSubmitComment = async () => {
      if (isBanned) {
        toast(`정지 중입니다. ${bannedUntil} 까지`, { icon: "⚠️" });
        return;
      }
      if (!newComment.trim()) {
        toast("댓글을 입력해주세요.", { icon: "⚠️" });
        return;
      }
        try {
            setIsSubmitting(true);
            await createComment(board_id, post.post_id, { content: newComment })
            setNewComment("");
            fetchPost();                         // 새 댓글 반영
        } catch (err) {
            console.error(err);
            toast("댓글 작성 중 오류 발생", { icon: "⚠️" });
        } finally {
            setIsSubmitting(false);
        }
        };

    
    if (!post) return <div className={styles.loading}>불러오는 중...</div>;
    const commentTree = buildCommentTree(post.comments || []);

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.page}>
        {/* ───── 헤더 영역 ───── */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            {isEditing ? (
              <input
                className={styles.editPostTitleInput}
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            ) : (
              <h1 className={styles.title}>{post.title}</h1>
            )}

            {(user?.user_id === post.user_id || user?.type === "admin") && (
              <div className={styles.actions}>
                {isEditing ? (
                  <>
                    <button
                      className={styles.editBtn}
                      onClick={handleSave}
                    >
                      저장
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setIsEditing(false)}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={styles.editBtn}
                      disabled={isBanned}
                      onClick={() => {
                        if (isBanned) {
                          toast(`정지 중입니다. ${bannedUntil} 까지`, { icon: "⚠️" });
                          return;
                        }
                        setIsEditing(true);
                        setEditedTitle(post.title);
                        setEditedContent(post.content);
                      }}
                    >
                      {isBanned ? "정지중" : "수정"}
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={handleDelete}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className={styles.meta}>
            <span className={styles.author}>{post.author_name}</span>
            <span className={styles.date}>
              {new Date(post.created_at).toLocaleString()}
            </span>
            {/* 🚨 게시글 신고 버튼 */}
            {!isEditing && (
              <>
                <button
                  className={styles.reportBtn}           // 필요하면 CSS 작성
                  onClick={() => setShowReportPost(true)}
                  disabled={isBanned}                    // 정지 중엔 신고 불가
                >
                  🚨 게시글 신고
                </button>

                {showReportPost && (
                  <ReportForm
                    targetType="post"
                    targetId={post.post_id}
                    onClose={() => setShowReportPost(false)}
                  />
                )}
              </>
            )}
          </div>

        </div>

        {/* ───── 본문 & 이미지 ───── */}
        <div className={styles.content}>
          {/* 읽기 모드 이미지 */}
          {!isEditing && post.images?.length > 0 && (
            <div className={styles.gallery}>
              {post.images.map((img) => (
                <img
                  key={img.image_url}
                  src={img.image_url.startsWith("http") ? img.image_url : `${API}${img.image_url}`}
                  alt="post"
                />
              ))}
            </div>
          )}

          {/* 수정 모드 폼 */}
          {isEditing ? (
            <>
              {/* 기존 이미지 썸네일 */}
              {existingImgs.length > 0 && (
                <div className={styles.gallery}>
                  {existingImgs.map((img) => (
                    <div key={img.image_id} className={styles.thumb}>
                      <img
                        src={img.image_url.startsWith("http") ? img.image_url : `${API}${img.image_url}`}
                        alt="old"
                      />
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => toggleRemoveExisting(img.image_id)}
                      >
                        {removedIds.includes(img.image_id) ? "↺" : "✕"}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 새 이미지 선택 */}
              <textarea
                className={styles.editPostContentTextarea}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={isBanned}
                onChange={handleFileChange}
              />

              {/* 새 이미지 미리보기 */}
              {newFiles.length > 0 && (
                <div className={styles.gallery}>
                  {newFiles.map((f) => (
                    <img
                      key={f.name}
                      src={f.previewURL}
                      alt="preview"
                      className={styles.preview}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p>{post.content}</p>
          )}
        </div>

        {/* ───── 댓글 영역 ───── */}
        <div className={styles.commentsSection}>
          <h3 className={styles.commentsTitle}>댓글</h3>
          {commentTree.length ? (
            <ul className={styles.commentList}>
              {commentTree.map((c) => (
                <CommentItem
                  key={c.comment_id}
                  comment={c}
                  boardId={board_id}
                  postId={post.post_id}
                  user={user}
                  fetchPost={fetchPost}
                />
              ))}
            </ul>
          ) : (
            <p className={styles.noComments}>댓글이 없습니다.</p>
          )}
        </div>

        {/* ───── 댓글 작성 폼 ───── */}
        <div className={styles.commentForm}>
          {isBanned && (
            <p className={styles.banMsg}>
              ⚠️  {new Date(bannedUntil).toLocaleString()} 까지 댓글 작성이 제한됩니다.
            </p>
          )}
          <textarea
            className={styles.commentTextarea}
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isBanned}
          />
          <button
            className={styles.commentButton}
            onClick={handleSubmitComment}
            disabled={isSubmitting || isBanned}
          >
            {isBanned ? "정지중" : isSubmitting ? "작성 중..." : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
