// src/pages/MyPage/MyPage.jsx
import { useAuth } from "../../hooks/useAuth";
import Header from "../../components/Common/Header";
import MyPageComponent from "../../components/MyPage/MyPageComponent";
import styles from "../../styles/Pages/Mypage.module.css";
import { Navigate } from "react-router-dom";

export default function MyPage() {
    const { user, loading } = useAuth();

    if (loading) return <p>로딩 중...</p>;
    if (!user) return <Navigate to="/login" />;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Header />
            </div>
            <div className={styles.content}>
                <MyPageComponent />
            </div>
        </div>
    );
}
