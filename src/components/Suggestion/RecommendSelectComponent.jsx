import {
    Outlet,
    useNavigate,
    useLocation,
} from "react-router-dom";
import styles from "../../styles/Suggestion/RecommendSelect.module.css";

const RecommendSelectComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const cards = [
        {
            path: "/recommend/select/time",
            title: "학년·월별 추천",
            desc: "학년과 월에 맞춰 계절과 학습 흐름을 반영한 활동 추천 목록 제공",
        },
        {
            path: "/recommend/select/profile",
            title: "내 프로필 맞춤",
            desc: "나의 관심사와 진로 희망을 바탕으로, 흥미와 목표에 맞는 챌린지 추천",
        },
        {
            path: "/recommend/select/history",
            title: "활동 기록 맞춤",
            desc: "챌린지·게시글·댓글 이력 등을 분석한 추천",
        },
    ];

    return (
        <div className={styles.componentContainer}>
            <div className={styles.wrapper}>
                <div className={styles.grid}>
                    {cards.map((c) => (
                        <ButtonCard
                            key={c.path}
                            title={c.title}
                            desc={c.desc}
                            active={location.pathname === c.path}
                            onClick={() => navigate(c.path)}
                        />
                    ))}
                </div>
            </div>
            <div className={styles.contentArea}>
                <Outlet />
            </div>
        </div>
    );
};

function ButtonCard({ title, desc, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`${styles.buttonCard} ${active ? styles.active : ""}`}>
            <div className={styles.title}>{title}</div>
            <div className={styles.desc}>{desc}</div>
        </button>
    );
}

export default RecommendSelectComponent;
