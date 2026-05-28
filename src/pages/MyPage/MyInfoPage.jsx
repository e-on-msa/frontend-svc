// src/pages/MyPage/MyInfoPage.jsx
import MyInfo from "../../components/MyPage/MyInfo";
import styles from "../../styles/MyPage/MyInfo.module.css";

const MyInfoPage = () => {
    return (
        <div className={styles.container}>
            <MyInfo />
        </div>
    );
};

export default MyInfoPage;
