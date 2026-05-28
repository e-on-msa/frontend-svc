import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../styles/Community/CommunityWrite.module.css";
import Header from "../../components/Common/Header";
import { createPost } from "../../api/communityApi";
import { useAuth }   from "../../hooks/useAuth";
import { toast } from "react-toastify";

const CommunityWrite = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);            // 이미지 배열
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isBanned, bannedUntil } = useAuth();

  const navigate = useNavigate();
  const { board_id } = useParams();

  /* ① 파일 선택 */
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).map((f) => {
      f.previewURL = URL.createObjectURL(f);          // 미리보기용
      return f;
    });
    setFiles((prev) => [...prev, ...selected]);
  };

  /* ② 파일 제거 */
  const handleRemove = (idx) => {
    URL.revokeObjectURL(files[idx].previewURL);
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  /* ③ 메모리 누수 방지 */
  useEffect(
    () => () => files.forEach((f) => URL.revokeObjectURL(f.previewURL)),
    [files]
  );

  /* ④ 글 등록 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isBanned) {
      toast(`정지중입니다. ${bannedUntil} 까지`, { icon: "⚠️" });
      return;
    }
    if (!title || !content) {
      toast("제목과 내용을 모두 입력해주세요.", { icon: "⚠️" });
      return;
    }

    try {
      setIsSubmitting(true);
      const fd = new FormData();
      fd.append("title", title);
      fd.append("content", content);
      files.forEach((f) => fd.append("images", f));

      await createPost(board_id, fd);

      toast("게시글이 등록되었습니다.", { icon: "💜" });
      navigate("/community");
    } catch (err) {
      console.error(err);
      toast("게시글 등록 중 오류가 발생했습니다.", { icon: "⚠️" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.headerWrapper}>
        <Header />
      </div>

      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h2 className={styles.title}>글쓰기</h2>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* 제목 */}
            <label className={styles.label}>제목</label>
            <input
              type="text"
              placeholder="제목을 입력하세요"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* 내용 */}
            <label className={styles.label}>내용</label>
            <textarea
              placeholder="내용을 입력하세요"
              className={styles.textarea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {/* 이미지 업로드 */}
            <label className={styles.label}>이미지 첨부 (여러 장 선택 가능)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />

            {/* 미리보기 */}
            {files.length > 0 && (
              <div className={styles.previewGrid}>
                {files.map((file, idx) => (
                  <div key={idx} className={styles.previewItem}>
                    <img
                      src={file.previewURL}
                      alt="preview"
                      className={styles.previewImg}
                    />
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => handleRemove(idx)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting || isBanned}
            >
              {isBanned
                ? "정지중"
                : isSubmitting
                ? "등록 중..."
                : "등록하기"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CommunityWrite;
