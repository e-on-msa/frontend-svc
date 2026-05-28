import styles from "../../styles/Pages/MySchoolManagement.module.css";
import MySchoolManagement from "../../components/MyPage/MySchoolManagement";

const MySchoolManagementPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <MySchoolManagement />
            </div>
        </div>
    );
};

export default MySchoolManagementPage;
