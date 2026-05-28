import { useState, useEffect } from "react";
import api from "../../api/axiosInstance";
import { useAuth } from "../../hooks/useAuth";
import styles from "../../styles/MyPage/MyInfo.module.css";
import { toast } from "react-toastify";

const MyInfo = () => {
    const { user, setUser } = useAuth();

    const [name, setName] = useState("");
    const [age, setAge] = useState(0);
    const [userType, setUserType] = useState("");
    const [emailNotification, setEmailNotification] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");

    const [message, setMessage] = useState({ type: "", text: "" });
    const [step, setStep] = useState(1); // 1: 인증 단계, 2: 정보 수정 단계

    // 초기값 세팅
    useEffect(() => {
        if (user) {
            setName(user.name);
            setAge(user.age);

            // 백엔드가 email_notification로 줄 수도, 프론트 컨텍스트가 camelCase로 줄 수도 있어 둘 다 대응
            const notif =
                user.email_notification ?? user.emailNotification ?? false;
            setEmailNotification(!!notif);

            user.type === "student"
                ? setUserType("학생")
                : setUserType("학부모");

        }
    }, [user]);

    // [로컬] 현재 비밀번호 검증
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

    // 저장
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        try {
            const payload = {
                ...(name !== undefined && { name }),
                ...(age !== undefined && { age }),
                ...(emailNotification !== undefined && { emailNotification }),
            };

            if (!currentPassword) {
                setMessage({
                    type: "error",
                    text: "현재 비밀번호를 입력하세요.",
                });
                return;
            }
            payload.currentPassword = currentPassword;

            const res = await api.put("/api/user/me", payload);

            setMessage({ type: "success", text: res.data.message });

            // 변경된 내 정보 다시 조회해서 Context 갱신
            try {
                const me = await api.get("/api/user/me");
                setUser(me.data.user);
            } catch (err) {
                console.warn("사용자 정보 재조회 실패", err);
            }

            setCurrentPassword("");
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || "수정에 실패했습니다.",
            });
        }
    };

    if (!user) return <p>로딩 중...</p>;

    return (
        <div className={styles.myInfoContainer}>
            {message.text && (
                <p
                    style={{
                        color: message.type === "error" ? "red" : "green",
                    }}>
                    {message.text}
                </p>
            )}

            {/* 1단계: 인증 단계 */}
            {step === 1 && (
                <form onSubmit={handleVerifyPassword} className={styles.form}>
                    <h3 className={styles.sectionTitle}>내 정보 수정</h3>
                    <div className={styles.formGroup}>
                        <label>현재 비밀번호 입력</label>
                        <input
                            className={styles.input}
                            type="password"
                            value={verifyPassword}
                            onChange={(e) => setVerifyPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        확인
                    </button>
                </form>
            )}

            {/* 2단계: 정보 수정 단계 */}
            {step === 2 && (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h3 className={styles.sectionTitle}>내 정보 수정</h3>
                    <div className={styles.formGroup}>
                        <label>이름</label>
                        <input
                            className={styles.input}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>나이</label>
                        <div className={styles.ageInputWrapper}>
                            <button
                                type="button"
                                className={`${styles.ageButton} ${
                                    age <= 8 ? styles.disabled : ""
                                }`}
                                onClick={() =>
                                    setAge((prev) => Math.max(8, prev - 1))
                                }
                                disabled={age <= 8}>
                                -
                            </button>
                            <input
                                type="number"
                                className={styles.input}
                                value={age}
                                min={8}
                                max={16}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value, 10);
                                    if (!isNaN(value)) {
                                        setAge(
                                            Math.max(8, Math.min(16, value))
                                        );
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className={`${styles.ageButton} ${
                                    age >= 16 ? styles.disabled : ""
                                }`}
                                onClick={() =>
                                    setAge((prev) => Math.min(16, prev + 1))
                                }
                                disabled={age >= 16}>
                                +
                            </button>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>이메일</label>
                        <input
                            className={styles.input}
                            type="email"
                            value={user.email}
                            disabled
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>회원 종류</label>
                        <input
                            className={styles.input}
                            type="text"
                            value={userType}
                            disabled
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            <input
                                type="checkbox"
                                checked={emailNotification}
                                onChange={(e) =>
                                    setEmailNotification(e.target.checked)
                                }
                            />
                            이메일 알림 수신 여부
                        </label>
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        저장하기
                    </button>
                </form>
            )}
        </div>
    );
};

export default MyInfo;
