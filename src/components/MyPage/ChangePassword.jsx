import { useState } from "react";
import api from "../../api/axiosInstance";
import styles from "../../styles/MyPage/MyInfo.module.css"; // 기존 CSS 재활용
import { toast } from "react-toastify";

const ChangePassword = () => {
    const [step, setStep] = useState(1);
    const [verifyPassword, setVerifyPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleVerifyPassword = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        try {
            const res = await api.post("/api/user/verify-password", {
                password: verifyPassword,
            });

            if (res.data.success) {
                toast("현재 비밀번호와 일치합니다.", {
                    icon: "🔐",
                    className: "my-toast",
                    progressClassName: "custom-progress-bar",
                });
                setCurrentPassword(verifyPassword);
                setVerifyPassword("");
                setStep(2);
            }
        } catch (err) {
            setMessage({
                type: "error",
                text:
                    err.response?.data?.message ||
                    "비밀번호가 일치하지 않습니다.",
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage({ type: "error", text: "모든 필드를 입력해주세요." });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({
                type: "error",
                text: "새 비밀번호가 일치하지 않습니다.",
            });
            return;
        }

        if (newPassword === currentPassword) {
            setMessage({
                type: "error",
                text: "현재 비밀번호와 동일한 비밀번호로는 변경할 수 없습니다.",
            });
            return;
        }

        try {
            const res = await api.put("/api/user/me/password", {
                currentPassword,
                newPassword,
            });
            setMessage({
                type: "success",
                text: res.data.message || "비밀번호가 변경되었습니다.",
            });
            // 성공 시 메인 페이지로 이동하거나 입력 초기화
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            // navigate('/mypage/info');
        } catch (err) {
            setMessage({
                type: "error",
                text:
                    err.response?.data?.message ||
                    "비밀번호 변경에 실패했습니다.",
            });
        }
    };

    return (
        <div className={styles.myInfoContainer}>
            {/* <h3 className={styles.sectionTitle}>비밀번호 변경</h3> */}
            {message.text && (
                <p
                    className={
                        message.type === "error"
                            ? styles.errorMessage
                            : styles.successMessage
                    }>
                    {message.text}
                </p>
            )}

            {step === 1 && (
                <form onSubmit={handleVerifyPassword} className={styles.form}>
                    <h3 className={styles.sectionTitle}>비밀번호 변경</h3>
                    <div className={styles.formGroup}>
                        <label>현재 비밀번호 입력</label>
                        <input
                            className={styles.input}
                            type="password"
                            value={verifyPassword}
                            onChange={(e) => setVerifyPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        확인
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>새 비밀번호</label>
                        <input
                            className={styles.input}
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>새 비밀번호 확인</label>
                        <input
                            className={styles.input}
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        변경하기
                    </button>
                </form>
            )}
        </div>
    );
};

export default ChangePassword;
