import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchRecommendationsByPreference } from "../../api/preference";
import PersonalRecommendationCard from "../../components/Suggestion/PersonalRecommendationCard";
import Header from "../../components/Common/Header";
import styles from "./RecommendationResult.module.css";

export default function RecommendationResult() {
    const [recommendations, setRecommendations] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem("user"))?.user_id;
        if (!userId) {
            console.error("❌ user_id를 localStorage에서 찾을 수 없습니다.");
            return;
        }
        fetchRecommendationsByPreference(userId)
            .then((data) =>
                setRecommendations(Array.isArray(data?.items) ? data.items : [])
            )
            .catch((err) => console.error("추천 로딩 실패:", err));
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {/* 추천 카드 리스트 */}
                {recommendations.length === 0 ? (
                    <div className={styles.emptyMessage}>
                        추천된 챌린지가 없습니다.
                    </div>
                ) : (
                    <div className={styles.cardList}>
                        {recommendations.map((item) =>
                            item ? (
                                <PersonalRecommendationCard
                                    key={item.challenge_id}
                                    challenge={item}
                                />
                            ) : null
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
