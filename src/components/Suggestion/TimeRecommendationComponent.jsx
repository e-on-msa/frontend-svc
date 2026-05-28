// src/pages/Suggestion/TimeRecommendation.jsx
import React, { useState } from "react";
import { fetchTimeRecommendations } from "../../api/timeRecommendation";
import TimeRecommendationCard from "../../components/Suggestion/TimeRecommendationCard";
import RecommendationModal from "../../components/Suggestion/RecommendationModal";
import styles from "../../pages/Suggestion/TimeRecommendation.module.css";

export default function TimeRecommendationComponent() {
    const [schoolType, setSchoolType] = useState("elementary");
    const [month, setMonth] = useState(1);
    const [grade, setGrade] = useState(1);
    const [recommendations, setRecommendations] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    // 추천 보기
    const handleFetch = async () => {
        try {
            const result = await fetchTimeRecommendations(
                schoolType,
                month,
                grade
            );
            setRecommendations(result);
        } catch (err) {
            console.error(err);
            alert("추천 정보를 불러오는 데 실패했습니다.");
        }
    };

    // 학년 변경 시 초/중 자동 설정
    const handleGradeChange = (e) => {
        const selectedGrade = Number(e.target.value);
        setGrade(selectedGrade);
        setSchoolType(selectedGrade <= 6 ? "elementary" : "middle");
    };

    return (
        <div className={styles.compomnentContainer}>
            <div className={styles.wrapper}>
                {/* 학년/월 선택 */}
                <div className={styles.selectRow}>
                    <label>
                        학년
                        <select value={grade} onChange={handleGradeChange}>
                            <optgroup label="초등학교">
                                {[1, 2, 3, 4, 5, 6].map((g) => (
                                    <option key={g} value={g}>
                                        초등 {g}학년
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label="중학교">
                                {[7, 8, 9].map((g) => (
                                    <option key={g} value={g}>
                                        중등 {g - 6}학년
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                    </label>

                    <label>
                        월
                        <select
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}>
                            {[...Array(12)].map((_, i) => (
                                <option key={i} value={i + 1}>
                                    {i + 1}월
                                </option>
                            ))}
                        </select>
                    </label>

                    <button className={styles.fetchBtn} onClick={handleFetch}>
                        추천 보기
                    </button>
                </div>

                {/* 추천 카드 리스트 */}
                {recommendations.length === 0 ? (
                    <div className={styles.emptyMessage}>
                        학년과 월을 선택하고 <strong>추천 보기</strong> 버튼을
                        눌러주세요.
                    </div>
                ) : (
                    <div className={styles.cardList}>
                        {recommendations.map((item) => (
                            <TimeRecommendationCard
                                key={item.item_id}
                                item={item}
                                onClick={() => setSelectedItem(item)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* 상세 모달 */}
            <RecommendationModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </div>
    );
}
