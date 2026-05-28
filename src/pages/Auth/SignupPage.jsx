import { useNavigate } from 'react-router-dom';
import SignupForm from '../../components/Auth/SignupForm';
import Header from "../../components/Common/Header";
import styles from "../../styles/Auth/SignupForm.module.css";

export default function Signup() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
                <Header />
            </div>
      <SignupForm onFinish={() => navigate('/login')} />
    </div>
  );
}
