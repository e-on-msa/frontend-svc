import { useNavigate } from 'react-router-dom';
import SignupForm from '../../components/Auth/SignupForm';
import styles from "../../styles/Auth/SignupForm.module.css";

export default function Signup() {
  const navigate = useNavigate();
  return (
    <div className={styles.loginWrapper}>
      <div className={styles.header}>
                <Header />
            </div>
      <h2>회원가입</h2>
      <SignupForm onFinish={() => navigate('/login')} />
    </div>
  );
}
