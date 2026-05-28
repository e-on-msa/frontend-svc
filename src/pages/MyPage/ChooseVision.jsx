// src/pages/MyPage/ChooseVision.jsx
import { useState, useEffect } from "react";
import styles from "../../styles/Pages/ChooseInterestVision.module.css";
import {
    getVisionCategories,
    getVisionsByCategory,
} from "../../api/preference";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const ChooseVision = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCategoryCode, setSelectedCategoryCode] = useState(null);
    const [categoryVisions, setCategoryVisions] = useState({}); // { [category_code]: VisionItem[] }
    const [selectedVisions, setSelectedVisions] = useState({}); // { [category_code]: string[] }  -> vision_detail 배열

    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

    // 카테고리 가져오기
    useEffect(() => {
        getVisionCategories().then(setCategories);
    }, []);

    // 선택한 카테고리의 관심사 불러오기 (캐시 없을 때만)
    useEffect(() => {
        const fetchVisions = async () => {
            if (
                selectedCategoryCode &&
                !categoryVisions[selectedCategoryCode]
            ) {
                const result = await getVisionsByCategory(selectedCategoryCode);
                setCategoryVisions((prev) => ({
                    ...prev,
                    [selectedCategoryCode]: result || [],
                }));
            }
        };
        fetchVisions();
    }, [selectedCategoryCode, categoryVisions]);

    const toggleVision = (categoryCode, visionDetail) => {
        setSelectedVisions((prev) => {
            const current = prev[categoryCode] || [];
            const next = current.includes(visionDetail)
                ? current.filter((v) => v !== visionDetail)
                : [...current, visionDetail];

            return { ...prev, [categoryCode]: next };
        });
    };

    const handleNext = async () => {
        // 전체 선택 평탄화
        const flatDetails = Object.values(selectedVisions).flat();
        if (flatDetails.length === 0) {
            alert("진로 희망을 최소 1개 이상 선택해주세요.");
            return;
        }

        // 모든 캐시에서 detail -> id 매핑 테이블 생성
        const allVisions = Object.values(categoryVisions).flat();
        const detailToId = new Map(
            allVisions.map((v) => [v.vision_detail, v.vision_id])
        );

        const visionIds = flatDetails
            .map((detail) => detailToId.get(detail))
            .filter(Boolean);

        try {
            await axiosInstance.post("/api/preferences/visions", {
                userId,
                visionIds,
            });
            navigate("/mypage/preferences-visions");
        } catch (err) {
            console.error("❌ 진로희망 저장 실패", err);
            alert("진로희망 저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className={styles.container}>
            <h2>진로 희망 선택</h2>

            <div className={styles.selectorRow}>
                {/* 카테고리 */}
                <div className={styles.column}>
                    {categories.map((cat) => (
                        <button
                            key={cat.category_code}
                            className={`${styles.categoryBtn} ${
                                cat.category_code === selectedCategoryCode
                                    ? styles.active
                                    : ""
                            }`}
                            onClick={() =>
                                setSelectedCategoryCode(cat.category_code)
                            }>
                            {cat.category_name}
                        </button>
                    ))}
                </div>

                {/* 비전 상세 */}
                <div className={styles.column}>
                    {categoryVisions[selectedCategoryCode]?.map((vision) => (
                        <button
                            key={vision.vision_detail}
                            className={`${styles.detailBtn} ${
                                selectedVisions[selectedCategoryCode]?.includes(
                                    vision.vision_detail
                                )
                                    ? styles.selected
                                    : ""
                            }`}
                            onClick={() =>
                                toggleVision(
                                    selectedCategoryCode,
                                    vision.vision_detail
                                )
                            }>
                            {vision.vision_detail}
                        </button>
                    ))}
                </div>
            </div>

            <button className={styles.submitBtn} onClick={handleNext}>
                선택 완료
            </button>
        </div>
    );
};

export default ChooseVision;
