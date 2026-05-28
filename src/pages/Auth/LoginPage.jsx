import { Link, useNavigate } from "react-router-dom";
// 이메일 찾기에 사용 두 줄
import {useState} from "react";
import FindIdModal from "./FindIdModal";
import Header from "../../components/Common/Header";
import LoginForm from "../../components/Auth/LoginForm";
import styles from "../../styles/Auth/LoginPage.module.css";

export default function Login() {
    const [showFindId, setShowFindId] = useState(false);
    const navigate = useNavigate();

    return (
        <div className={styles.loginWrapper}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <Header />
                </div>
                <div className={styles.content}>
                    <div className={styles.loginBox}>
                        <div className={styles.logoText}>E-ON</div>
                        <div className={styles.loginTitle}>로그인</div>

                        <LoginForm
                            onSuccess={() => {
                                setTimeout(() => {
                                    navigate("/");
                                    window.location.reload(); // 로그인 후 새로고침 (1)
                                    window.location.reload(); // 로그인 후 새로고침 (2)
                                }, 200);
                            }}
                            showFindId={showFindId}           
                            setShowFindId={setShowFindId} 
                        />


                        {/* 회원가입 */}
                        <Link to="/signup" className={styles.signupButton}>
                            회원가입
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
