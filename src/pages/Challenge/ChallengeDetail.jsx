import Header from "../../components/Common/Header";
import ChallengeDetailComponent from "../../components/Challenge/ChallengeDetailComponent";
import styles from "../../styles/Challenge/ChallengeDetail.module.css";

const ChallengeDetail = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Header />
            </div>
            <div className={styles.content}>
                <ChallengeDetailComponent />
            </div>
        </div>
    );
};

export default ChallengeDetail;
