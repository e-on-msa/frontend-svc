// src/pages/MyPage/MyPage.jsx (관리자 페이지)
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast"; // toast import 필요
import styles from "../../styles/Pages/Mypage.module.css";
import Header from "../../components/Common/Header";
import AdminPageComponent from "../../components/Admin/AdminPageComponent";

export default function AdminPage() {
    const { user, loading } = useAuth();

    // 로딩 중
    if (loading) return <p>로딩 중...</p>;

    // 로그인 안 한 경우 로그인 페이지로
    if (!user) return <Navigate to="/login" />;

    // 관리자 권한 체크
    if (user.type !== "admin") {
        toast("일반 사용자는 관리자 페이지에 접근할 수 없습니다.", {
            icon: "💜",
            className: "my-toast",
            progressClassName: "custom-progress-bar",
        });
        return <Navigate to="/calendar" />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Header />
            </div>

            <div className={styles.content}>
                <AdminPageComponent />
            </div>
        </div>
    );
}
