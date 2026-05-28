import { useState, useEffect } from "react";
import Header from "../../components/Common/Header";
import styles from "../../styles/Challenge/Challenge.module.css";
import ChallengeComponent from "../../components/Challenge/ChallengeComponent";
import { useAuth } from "../../hooks/useAuth";

const Challenge = () => {
    const { user, loading: authLoading } = useAuth();

    // 로그인 모달 상태
    const [showLoginModal, setShowLoginModal] = useState(false);

    // 로그인 상태 감지하여 모달 띄움
    useEffect(() => {
        if (!authLoading && !user) {
            setShowLoginModal(true);
        }
    }, [user, authLoading]);

    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                {/* 로그인 안내 모달 */}
                {showLoginModal && (
                    <div className={styles.loginModalOverlay}>
                        <div className={styles.loginModalContent}>
                            <h3>로그인이 필요합니다</h3>
                            <div className={styles.loginModalText}>
                                이 페이지는 로그인 후 이용하실 수 있습니다.
                            </div>
                            <button
                                className={styles.loginModalButton}
                                onClick={() => {
                                    setShowLoginModal(false);
                                    window.location.href = "/login";
                                }}>
                                로그인 하러 가기
                            </button>
                        </div>
                    </div>
                )}

                <div className={styles.header}>
                    <Header />
                </div>

                <div className={styles.content}>
                    <ChallengeComponent />
                </div>
            </div>
        </div>
    );
};

export default Challenge;
