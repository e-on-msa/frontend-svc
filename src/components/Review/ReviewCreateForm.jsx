// src/components/Review/ReviewCreateForm.jsx

import { useState, useEffect } from "react";

const ReviewCreateForm = ({
  challengeId,
  mode = "create",     
  initialData = null, 
  onSubmit,            
}) => {
  // form 상태: rating, text
  // (title 필드는 예시에서 따로 API 스펙 없음 → title 입력란은 제거했습니다)
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  // 수정 모드라면 초기값을 한 번 설정
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setRating(initialData.rating_stars || 0);
      setContent(initialData.text || "");
    }
  }, [mode, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 검증: rating은 1~5, content 빈문자열 아님
    if (rating < 1 || content.trim() === "") return;

    // onSubmit 콜백이 전달된 경우, 부모가 API 호출을 처리할 수 있도록 전달
    if (onSubmit) {
      onSubmit({ rating_stars: rating, text: content });
      return;
    }

    // onSubmit이 없으면 단순 alert
    alert(
      mode === "create"
        ? `리뷰 등록!\n별점: ${rating}\n내용: ${content}`
        : `리뷰 수정!\n별점: ${rating}\n내용: ${content}`
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "80vw",
        maxWidth: 1100,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 14,
        padding: "46px 54px 38px 54px",
        boxShadow: "0 2px 12px #f3f4f6",
        border: "1.5px solid #e5e7eb",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 28,
          marginBottom: 36,
          textAlign: "left",
          letterSpacing: "-1px",
        }}
      >
        {mode === "create" ? "리뷰 작성" : "리뷰 수정"}
      </div>

      {/* 별점 */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 18 }}>
          평점 선택
        </div>
        <div>
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              style={{
                fontSize: 54,
                color: num <= rating ? "#facc15" : "#e5e7eb",
                cursor: "pointer",
                margin: "0 10px",
              }}
              onClick={() => setRating(num)}
              role="button"
              aria-label={`${num}점`}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* 내용 입력 */}
      <textarea
        style={{
          width: "100%",
          minHeight: 160,
          border: "1.5px solid #e5e7eb",
          borderRadius: 8,
          padding: "17px 16px",
          fontSize: 17,
          marginBottom: 32,
          background: "#fafafa",
          resize: "vertical",
        }}
        placeholder="리뷰 내용을 입력하세요."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      {/* 저장 버튼 */}
      <button
        type="submit"
        style={{
          width: "180px",
          display: "block",
          margin: "0 auto",
          background: rating > 0 && content.trim() !== "" ? "#2563eb" : "#d4d4d4",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontWeight: "bold",
          fontSize: 19,
          padding: "13px 0",
          cursor: rating > 0 && content.trim() !== "" ? "pointer" : "not-allowed",
          letterSpacing: 2,
        }}
        disabled={rating === 0 || content.trim() === ""}
      >
        저장
      </button>
    </form>
  );
};

export default ReviewCreateForm;
