// src/components/MyPage/MyPageComponent.jsx
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styles from "../../styles/MyPage/MypageComponent.module.css";

const MyPageComponent = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <p>로딩 중...</p>;
    if (!user) return <Navigate to="/login" />;

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.menuList}>
                    <Link
                        to="/mypage/info"
                        className={`${styles.menuItem} ${
                            location.pathname === "/mypage/info"
                                ? styles.active
                                : ""
                        }`}>
                        내 정보 수정
                    </Link>
                    <Link
                        to="/mypage/my-school"
                        className={`${styles.menuItem} ${
                            location.pathname === "/mypage/my-school"
                                ? styles.active
                                : ""
                        }`}>
                        나의 학교 관리
                    </Link>
                    <Link
                        to="/mypage/activity-history"
                        className={`${styles.menuItem} ${
                            location.pathname === "/mypage/activity-history"
                                ? styles.active
                                : ""
                        }`}>
                        활동 이력 조회
                    </Link>
                    <Link
                        to="/mypage/preferences-visions"
                        className={`${styles.menuItem} ${
                            location.pathname === "/mypage/preferences-visions"
                                ? styles.active
                                : ""
                        }`}>
                        관심분야 및 진로희망
                    </Link>
                    <Link
                        to="/mypage/boardrequest"
                        className={`${styles.menuItem} ${
                            location.pathname === "/mypage/boardrequest"
                                ? styles.active
                                : ""
                        }`}>
                        게시판 개설 신청 현황
                    </Link>
                    <Link
                        to="/mypage/my-challenges"
                        className={`${styles.menuItem} ${
                            location.pathname === "/mypage/my-challenges"
                                ? styles.active
                                : ""
                        }`}>
                        내가 신청한 챌린지
                    </Link>
                    <Link
                        to="/mypage/created-challenges"
                        className={`${styles.menuItem} ${
                            location.pathname === "/mypage/created-challenges"
                                ? styles.active
                                : ""
                        }`}>
                        내가 개설한 챌린지
                    </Link>
                    <Link
                        to="/mypage/password"
                        className={`${styles.menuItem} ${
                            location.pathname === "/mypage/password"
                                ? styles.active
                                : ""
                        }`}>
                        비밀번호 변경
                    </Link>
                    <Link
                        to="/mypage/deactivate"
                        className={`${styles.menuItem} ${
                            location.pathname === "/mypage/deactivate"
                                ? styles.active
                                : ""
                        }`}>
                        계정 탈퇴 / 비활성화
                    </Link>
                </div>
            </div>
            <div className={styles.contentArea}>
                <Outlet />
            </div>
        </div>
    );
};

export default MyPageComponent;
