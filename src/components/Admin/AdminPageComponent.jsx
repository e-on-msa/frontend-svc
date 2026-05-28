// src/components/MyPage/MyPage.jsx
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styles from "../../styles/MyPage/MypageComponent.module.css";
import { toast } from "react-toastify";

const AdminPageComponent = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <p>로딩 중...</p>;
    if (!user) return <Navigate to="/login" />;
    if (user.type !== "admin") {
        <Navigate to="/calendar" />;
        toast("일반 사용자는 관리자 페이지에 접근할 수 없습니다.", {
            icon: "💜",
            className: "my-toast",
            progressClassName: "custom-progress-bar",
        });
    }

    return (
        <div className={styles.container}>
            <div className={styles.sidebar2}>
                <div className={styles.menuList}>
                    <Link
                        to="/admin/user-management"
                        className={`${styles.menuItem} ${
                            location.pathname === "/admin/user-management"
                                ? styles.active
                                : ""
                        }`}>
                        사용자 관리
                    </Link>
                    <Link
                        to="/admin/board-requests"
                        className={`${styles.menuItem} ${
                            location.pathname === "/admin/board-requests"
                                ? styles.active
                                : ""
                        }`}>
                        게시판 개설 요청
                    </Link>
                    <Link
                        to="/admin/challenge-requests"
                        className={`${styles.menuItem} ${
                            location.pathname === "/admin/challenge-requests"
                                ? styles.active
                                : ""
                        }`}>
                        챌린지 개설 요청
                    </Link>
                    <Link
                        to="/admin/reports"
                        className={`${styles.menuItem} ${
                            location.pathname === "/admin/reports"
                                ? styles.active
                                : ""
                        }`}>
                        게시글 및 댓글 신고
                    </Link>
                </div>
            </div>
            <div className={styles.contentArea2}>
                {/* 하위 페이지 컴포넌트 로딩 */}
                <Outlet />
            </div>
        </div>
    );
};

export default AdminPageComponent;
