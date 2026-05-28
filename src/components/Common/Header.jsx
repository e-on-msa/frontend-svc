import styles from "./../../styles/Common/Header.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";
// import notification from "../../assets/notification.svg";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
            window.location.reload(); // 로그아웃 후 새로고침
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // console.log("location: ", location);

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Link to="/" className={styles.logoLink}>
                    <img src={logo} alt="Logo" className={styles.logo} />
                </Link>
            </div>
            <div className={styles.navContainer}>
                <ul
                    className={`${styles.navList} ${
                        user ? styles.navListSmallGap : styles.navListLargeGap
                    }`}>
                    <li
                        className={`${styles.navItem} ${
                            location.pathname === "/calendar"
                                ? styles.active
                                : ""
                        }`}>
                        <Link to="/calendar" className={styles.navLink}>
                            학사 일정
                        </Link>
                    </li>
                    <li
                        className={`${styles.navItem} ${
                            location.pathname.startsWith("/challenge") ||
                            location.pathname.startsWith("/attendance")
                                ? styles.active
                                : ""
                        }`}>
                        <Link to="/challenge" className={styles.navLink}>
                            챌린지
                        </Link>
                    </li>
                    <li
                        className={`${styles.navItem} ${
                            location.pathname.startsWith("/recommend")
                                ? styles.active
                                : ""
                        }`}>
                        <Link
                            to="/recommend/select"
                            className={styles.navLink}>
                            AI 맞춤 추천
                        </Link>
                    </li>
                    <li
                        className={`${styles.navItem} ${
                            location.pathname === "/community"
                                ? styles.active
                                : ""
                        }`}>
                        <Link to="/community" className={styles.navLink}>
                            커뮤니티
                        </Link>
                    </li>

                    {user ? (
                        <>
                            <li
                                className={`${styles.navItem} ${
                                    location.pathname.startsWith("/mypage") ||
                                    location.pathname.startsWith("/admin")
                                        ? styles.active
                                        : ""
                                }`}>
                                {user.type !== "admin" ? (
                                    <Link
                                        to="/mypage"
                                        className={styles.navLink}>
                                        마이페이지
                                    </Link>
                                ) : (
                                    <Link
                                        to="/admin"
                                        className={styles.navLink}>
                                        관리자 페이지
                                    </Link>
                                )}
                            </li>
                            <li className={styles.navItem}>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className={`${styles.navItem} ${styles.navLink}`}>
                                    로그아웃
                                </button>
                            </li>
                        </>
                    ) : (
                        <li className={styles.navItem}>
                            <Link to="/login" className={styles.navLink}>
                                로그인/회원가입
                            </Link>
                        </li>
                        
                    )}

                </ul>
            </div>
        </header>
    );
}
