// src/pages/Suggestion/RecommendSelect.jsx
import Header from "../../components/Common/Header";
import styles from "../../styles/Suggestion/RecommendSelect.module.css";
import RecommendSelectComponent from "../../components/Suggestion/RecommendSelectComponent";

export default function RecommendSelect() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Header />
            </div>
            <div className={styles.content}>
                <RecommendSelectComponent />
            </div>
        </div>
    );
}
