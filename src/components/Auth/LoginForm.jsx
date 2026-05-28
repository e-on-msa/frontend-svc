import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import styles from "../../styles/Auth/LoginForm.module.css";
import { Link, useLocation } from "react-router-dom";
import FindIdModal from "../../pages/Auth/FindIdModal.jsx";
import FindPasswordModal from "../../pages/Auth/FindPasswordModal.jsx";

export default function LoginForm({ onSuccess, showFindId, setShowFindId }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showFindPw, setShowFindPw] = useState(false);

  // 🔧 추가: 모달 상태를 추적하여 submit 방지
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setEmail("");
  }, []);

  useEffect(() => {
    const url = new URLSearchParams(location.search);
    url.delete("email");
    window.history.replaceState({}, document.title, "/login");
  }, []);

  // 🔧 수정: 모달 오픈 시 isModalOpen도 true로 설정
  const openFindIdModal = () => {
    setShowFindId(true);
    setIsModalOpen(true);
  };

  const openFindPwModal = () => {
    setShowFindPw(true);
    setIsModalOpen(true);
  };

  const closeModals = () => {
    setShowFindId(false);
    setShowFindPw(false);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (isModalOpen) return;

  console.log("🧪 handleSubmit 실행됨");
  setError("");
  try {
    const data = await login({ email, password });
    console.log("✅ 로그인 성공!", data);

    if (typeof onSuccess === "function") {
      console.log("🎯 onSucces 실행함");
      onSuccess();
    } else {
      console.warn("⚠️ onSucces가 함수가 아님:", onSuccess);
    }
  } catch (err) {
    console.error("❌ 로그인 에러:", err);
    setError(err.response?.data?.message || "로그인 실패 😢");
  }
};


  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.inputGroup}>
        <label>이메일</label>
        <input
          type="email"
          placeholder="이메일을 입력해주세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력해주세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className={styles.findIdRow}>
        <button
          type="button"
          className={styles.findIdLink}
          onClick={openFindIdModal}
        >
          아이디 찾기
        </button>
        <span className={styles.divider}>|</span>
        <button
          type="button"
          className={styles.findIdLink}
          onClick={openFindPwModal}
        >
          비밀번호 찾기
        </button>
      </div>

      {/* 🔧 모달 닫힐 때 closeModals 사용 */}
      {showFindId && <FindIdModal onClose={closeModals} />}
      {showFindPw && <FindPasswordModal onClose={closeModals} />}

      <button type="submit" className={styles.loginButton}>
        로그인
      </button>
    </form>
  );
}
